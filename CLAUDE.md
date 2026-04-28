# CLAUDE.md

Этот файл содержит инструкции для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## О проекте

Статический фронтенд без сборки для **dns.ice.io** — dApp для покупки, управления и продления `.ion` DNS-записей в блокчейне ION. Изначально это форк dns.ton.org, переведённый на ION mainnet. **Здесь нет бандлера, package.json, тест-раннера и шага транспиляции.** Браузер загружает `index.html` / `about.html` напрямую; весь JS — обычный ES (преимущественно ES5/ES6), подключаемый через `<script>`-теги в строгом порядке зависимостей.

## Локальная разработка

```bash
# Поднять статический сервер на порту 5500 (подойдёт любой)
npx http-server -p 5500

# Для отладки кошелька через ION Wallet проброс через ngrok и обновление
# поля `url` в `tonconnect-manifest.json` на ngrok-адрес
ngrok http 5500
```

Шагов lint/test/build нет. Cache-busting сделан вручную через query-суффиксы вида `?20` на каждом `<script>`/`<link>` в `index.html` / `about.html` — увеличивайте их при выкладке изменений CSS/JS, которые могут закэшироваться в браузере.

Для smoke-тестирования флоу подключения кошелька в реальном браузере нужно расширение **ION Wallet** ([Chrome Web Store](https://chromewebstore.google.com/detail/ion-wallet/hfajfpbjlmembfdlhakjmefnbhjddofb)). Без расширения путь после нажатия «Поставить» / «Продлить» / «Сохранить» в manage не пройти — ION Wallet поддерживает только Chrome (`wallets-v2.json` → `platforms: ["chrome"]`).

## Сетевая конфигурация

Все ION-специфичные значения находятся в `src/constants.js`:

- **JSON-RPC**: `ION_RPC_ENDPOINT = https://api.mainnet.ice.io/http/v2/jsonRPC` — TonCenter-совместимый эндпоинт ION mainnet, используется через `TonWeb.HttpProvider`. API-ключ не требуется (`ION_RPC_API_KEY = ''`).
- **Адрес рут-контракта DNS-коллекции**: `ION_DNS_COLLECTION_ADDRESS = EQDcWMSUNYZja-gCidL10h9Fvq4agkMIwF1SbI2xv_T5yw2O` — mainnet.
- **Эксплорер**: `ION_EXPLORER_ENDPOINT = https://explorer.ice.io` (для ссылок «посмотреть адрес»).
- Только mainnet, **тестнета нет** — `IS_TESTNET`/`TestnetController`/`?testnet=true` полностью выпилены.

`AUCTION_START_TIME = 1776589200` (Sun 19 Apr 2026 09:00:00 GMT) в `src/index.js` — должно совпадать с константой `auction_start_time` в `../ion-dns-contract/contracts/dns-utils.fc`.

## Архитектура

### Точка входа и порядок загрузки

`index.html` — источник истины для подключения модулей. Скрипты загружаются в строгом порядке зависимостей; перед перестановкой проверьте конец файла. Ключевые глобалы, появляющиеся по ходу загрузки:

- `state.js` → создаёт `store` (миниатюрный pub-sub `State` с мутируемыми полями вроде `localeDict`, `theme`, `wallet`)
- `controllers/themeController.js` → инстанцируется инлайн в `<head>` (светлая/тёмная тема)
- `utils.js` → DOM-хелперы (`$`, `toggle`, `setScreen`, `getCoinPrice`, `formatNumber`, history storage и т.п.)
- `@ion-gateway/ui` + `@ion-gateway/sdk` (CDN, `unpkg`) — ION-форк TonConnect.
  - **UI-bundle экспонирует глобал `ION_CONNECT_UI`** (`ION_CONNECT_UI.TonConnectUI`, `ION_CONNECT_UI.THEME`).
  - **SDK-bundle оставил оригинальный namespace `TonConnectSDK`** (`TonConnectSDK.TonConnect`, `TonConnectSDK.UserRejectsError`, `TonConnectSDK.toUserFriendlyAddress`). API один-в-один совместимо с `@tonconnect/sdk` оригинала — это не опечатка.
- TonWeb 0.0.59 (вендорный, оригинальный — DNS-контракт ION идентичен `.ton` по интерфейсу), jQuery 3.4.1, lottie-player, BigNumber, IMask
- `src/constants.js` → ION endpoints, рут-адрес коллекции
- `src/index.js` → оркестрация на уровне страницы, выполняется при загрузке (большая часть логики не обёрнута в DOMContentLoaded)

`about.html` — отдельная страница, использует те же CSS и подмножество JS.

### Список кошельков для TonConnect

`wallets-v2.json` в **корне репо** — локальный список кошельков, который мы передаём в SDK через `walletsListSource: '/wallets-v2.json'` + `walletsListCacheTTLMs: 0` (в `walletController.js`). Содержит ровно одну запись для **ION Wallet** (`app_name: ionmask`, `bridge: js/ion`, `about_url` ведёт на Chrome Web Store расширения).

Без этого файла SDK падает на встроенный hardcoded fallback со списком TON-кошельков (Tonkeeper, MyTonWallet, Bybit, OKX и т.д.) — и UI начинает ходить по их bridge-эндпоинтам. Не удаляйте файл и не оставляйте дефолтный `walletsListSource`.

### Контроллеры (создаются в `src/index.js`)

- `WalletController` — обёртка над `TonConnectSDK` (SDK) + `ION_CONNECT_UI` (UI); предоставляет `isLoggedIn`, `getAccountAddress`, `sendTransaction(tx, onSuccess, onRejection, onError)`. `UserRejectsError` — сигнал отказа пользователя.
- `LocaleController` — загружает локаль для текущей страницы (`localeDict: 'index'` или `'about'`) в `store.localeDict`. Все пользовательские строки берутся отсюда.
- `ThemeController`, `FlipTimerController` (из `controllers/flipTimerController.js`, экспонирует глобальный `FlipTimer`).

### Доменный флоу (ядро `src/index.js`)

1. `processUrl()` читает `window.location.hash` и либо валидирует домен через `validateDomain`, либо возвращает на `startScreen`.
2. `setDomain(domain)` резолвит DNS-айтем через `dnsCollection.resolve(...)` от рут-контракта ION-коллекции, затем вызывает `getAddressInfo`/`DnsItem.methods.getData`/`getAuctionInfo`/`getLastFillUpTime`, чтобы определить одно из трёх состояний:
   - **free** → `renderFreeDomain` → `freeDomainScreen`
   - **busy** (есть владелец) → `renderBusyDomain` → `busyDomainScreen` (показывает renew, если домен принадлежит пользователю и до истечения осталось не больше `DOMAIN_RENEW_LIMIT_IN_DAYS=180` дней или уже истёк)
   - **auction** → `renderAuctionDomain` → `auctionDomainScreen` с flip-clock-таймером
3. `setInterval` каждые 10 секунд перезапускает загрузку, чтобы держать состояние свежим; `clear()` снимает интервал при навигации.
4. `togglePaymentModal({ modalType, domain, price, address, payloadIn })` — единая модалка для bid / renew / manage. Типы модалки: `'place a bid'`, `'renew'`, `'manage domain'`. Транзакция собирается из payload через `getAuctionBidPayload`, `getChangeDnsRecordPayload` или `getManageDomainPayload` (всё в `utils.js`), и отправляется через `walletController.sendTransaction` (которая в свою очередь — `tonConnectUI.sendTransaction`).

### Auto-confirm после подключения кошелька

`checkIfLoggedIn` (внутри `togglePaymentModal`) ведёт себя так:
- Если кошелёк уже подключён — сразу вызывает `handlePaymentConfirmation()` и шлёт транзакцию.
- Если **нет** — открывает `tonConnectUI.openModal()` и одновременно вешает одноразовый listener на `tonConnectUI.onStatusChange`. Как только пользователь подключит ION Wallet, listener сам отписывается и автоматически отправляет транзакцию — без второго клика.

При изменении этого флоу не забывайте `unsub()` в первой ветке колбэка, иначе подписка протекает на каждый клик.

### Флоу управления доменом

`toggleManageDomainForm` (доступен только текущему владельцу) читает четыре DNS-категории из DnsItem (`DNS_CATEGORY_WALLET`, `DNS_CATEGORY_SITE`, `DNS_CATEGORY_STORAGE`, `DNS_CATEGORY_NEXT_RESOLVER`), заполняет инпуты `#editWalletRow` / `#editAdnlRow` / `#editStorageRow` / `#editResolverRow`, и при сохранении собирает запись через `TonWeb.dns.create*Record(...)`, упаковывает её в payload через `getManageDomainPayload` и направляет в `togglePaymentModal` с ценой `MANAGE_DOMAIN_PRICE = 0.25` ICE. Чекбокс `#siteStorage` переключает site-запись между ADNL-адресом и Storage Bag ID.

### Состояние / цены / константы

- `MS_IN_ONE_LEAP_YEAR = 31622400000` — используется для расчёта даты истечения домена из `lastFillUpTime`.
- `RENEW_DOMAIN_PRICE = 0.075`, `MANAGE_DOMAIN_PRICE = 0.25` (в ICE; цены ×5 от TON-оригинала — это эмпирические значения, не из контракта).
- `DOMAIN_RENEW_LIMIT_IN_DAYS = 180` — окно видимости кнопки renew.
- `getMinPrice(domain)` (в `utils.js`) — стартовая цена аукциона в зависимости от длины домена. **Таблица `getMinPriceConfig` синхронизирована с `../ion-dns-contract/contracts/dns-utils.fc → get_min_price_config`** (цены ×100 от TON-оригинала). Формула декея (×0.9 каждый месяц с потолком в 21 месяц) и аукцион-длительность (с `auction_start_duration = 1 неделя` до `auction_end_duration = 1 час` за 12 месяцев) тоже совпадают с контрактом.
- `getCoinPrice()` — **TODO: подключить ICE/USD price endpoint**, сейчас возвращает `Promise.resolve(null)` и USD-конвертация в UI скрыта через CSS (`.converted__price { display: none }` в `css/dns.css`).

### Экраны

`setScreen(name)` (в `utils.js`) — единственный примитив переключения экранов. Известные экраны: `startScreen`, `domainLoadingScreen`, `freeDomainScreen`, `busyDomainScreen`, `auctionDomainScreen`. Текущий активный хранится в глобале `ACTIVE_SCREEN`.

## Соглашения, специфичные для этого кода

- **Глобалы повсюду.** Константы в `src/constants.js` (и магические числа, переобъявленные в начале `src/index.js`) — это голые присваивания без `const`/`let`, они намеренно становятся `window`-глобалами и используются другими скриптами. Не «чините» это, не разобравшись в порядке загрузки.
- **Никаких модулей / никакого `import`.** Не добавляйте ES-модульный синтаксис — он сломает загрузку. Новые файлы добавляйте через ещё один `<script>`-тег в `index.html` (и `about.html`, если нужно), в правильном месте цепочки зависимостей.
- **jQuery загружен, но `$` переопределён** в `utils.js` как короткая запись `document.querySelector`. Используйте `$('#id')` / `$('.class')` соответственно.
- **DOM-мутация — норма.** Этот код предшествует иммутабельным паттернам и повсеместно использует прямые `style.display` / `classList` / `innerText`. Новый код должен следовать тому же стилю для консистентности — не тащите фреймворк.
- **Локализованные строки** обязательно через `store.localeDict.<key>` — никогда не хардкодьте пользовательский текст. Содержимое словарей в `src/controllers/localeController.js`.
- **Cache-busting**: при изменении любого файла в `src/**` или `css/**` инкрементируйте query `?20` в соответствующих script/link-тегах в `index.html` / `about.html`, чтобы продакшн-CDN отдавал новую версию. Эта практика особенно важна сейчас — после миграции в браузерах пользователей могут лежать старые `utils.js` / `index.js` / `walletController.js` от TON-версии.
- **Аналитика**: `analyticService.sendEvent({ type: 'event_name' })` (бэкенд Plausible через `src/analytics.js`, домен `dns.ice.io`). Существующие типы событий: `view_domain_info`, `place_an_initial_bid`, `place_a_bid`, `edit_domain`.
- **Перед удалением DOM-узла из HTML** — найдите все его обращения в JS (`grep "#id" src/`). После выпиливания QR/Tonkeeper-блока словили несколько TypeError из-за залётных `$('#freeQr')` / `$('#bidPrice')` / `$('.bid__modal--second__step ...')` в `utils.js` и `index.js` — не повторяйтесь.

## Что было выпилено при миграции с TON на ION (для контекста)

Если будете искать в истории — этих фич в коде больше нет:

- Тестнет (`TestnetController`, `IS_TESTNET`, `?testnet=true`, тестнет-бейдж).
- Getgems-интеграция (`api.getgems.io/ton-dns`, кнопки Buy/Place bid/Make offer на busy-доменах, секции `// GG INTEGRATION`).
- «My Domains» (контроллер, view, кнопка в навигации, `TONAPI_WRAPPER_API`/expiring-domains, `css/my-domains.css`).
- Tonkeeper deeplinks и QR-блок: `app.tonkeeper.com/transfer/...`, `#freeQr`, `#tonkeeperButton`, `#copyLinkbutton`, `#freeBtn`, `#otherPaymentsMethods`, `#otherPaymentsMethodsContainer`, `#freeComment`, `#transactionAddress`, секция `bid__modal--second__step`, утилита `renderQr`, lib `qr-code-styling`. Если кошелёк не подключён — открывается стандартный TonConnect-modal через `tonConnectUI.openModal()`.

## TODO

### Контент / брендинг
- **Подключить ICE/USD price endpoint** в `getCoinPrice()` (`src/utils.js`); вернуть USD-конвертацию в UI (снять `display: none` с `.converted__price` в `css/dns.css`).

### Деплой
- **Bump cache-bust query** `?20` → новая версия во всех `<script>`/`<link>` тегах `index.html` и `about.html` перед выкаткой — иначе у пользователей с открытым сайтом останется старый код TON-версии.

### Несущественные шумы (не блокирующие)
- В network видна 404 на `https://raw.githubusercontent.com/ion-gateway/sdk/main/assets/ton-icon-48.png` — иконка зашита внутри `@ion-gateway/sdk` bundle, в их репо отсутствует. Не наша проблема, чинится только апстрим.
- `og_snippet.jpeg` всё ещё с TON-брендингом — отдельный TODO, если важно для шаринга.
