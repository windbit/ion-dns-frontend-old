class LocaleController {
	constructor(props) {
		this.registerLocaleDict('index', INDEX_LOCALES)
		this.registerLocaleDict('about', ABOUT_LOCALES)

		this.store = props.store
		this.store.subscribe(this, 'setLocale', (locale) => {
			this.store.dispatch('setLocaleDict', this[props.localeDict][locale])
		})
		this.store.subscribe(this, 'setLocaleDict', (localeDict) => {
			if (this.store.locale !== 'en') {
				document.querySelectorAll('[data-locale]').forEach((node) => {
					const key = node.attributes['data-locale'].value
					node.innerHTML = localeDict[key]
				})

				document
					.querySelectorAll('[data-placeholder-locale]')
					.forEach((input) => {
						const key = input.attributes['data-placeholder-locale'].value
						input.placeholder = localeDict[key]
					})
			}
		})
	}

	init() {
		const browserLang = navigator.language || navigator.userLanguage
		const lang =
			browserLang === 'ru-RU' ||
			browserLang === 'ru' ||
			browserLang === 'be-BY' ||
			browserLang === 'be' ||
			browserLang === 'kk-KZ' ||
			browserLang === 'kk'
				? 'ru'
				: 'en'

		this.store.dispatch('setLocale', lang)

		return this
	}

	registerLocaleDict(locale, localeDict) {
		this[locale] = this[locale] || localeDict
	}
}

const INDEX_LOCALES = {
	ru: {
		about: 'О сервисе',
		dark_mode: 'Темная тема',
		address: 'Адрес',
		adnl: 'ADNL адрес',
		testnet_badge_message: 'Внимание, это тестовая сеть! Не отправляйте настоящие TON. Тестовые домены могут быть удалены.',
		open_auction: 'Зарегистрировать домены .ion',
		start_input_placeholder: 'Введите домен',
		start_splash: 'Зарегистрируйте короткие читаемые имена для кошельков, смарт-контрактов и веб-сайтов.',
		more_info: 'Подробнее<span class="icon arrow__right unbreak"></span>',
		highest_bid: 'Текущая ставка',
		from: 'От',
		bid_step: 'Шаг ставки',
		minimum_bid: 'Минимальная ставка',
		auction_ends: 'Аукцион закончится через',
		place_bid: 'Сделать ставку',
		sale_price: 'Цена покупки',
		owner: 'Владелец',
		wallet_address: 'Адрес кошелька',
		save: 'Сохранить',
		ton_site: 'ION Site',
		subdomains: 'Поддомены',
		expires: 'Истекает <span id="expiresDate"></span>',
		edit: 'Редактировать',
		bet_price: 'Ставка',
		start_bid: 'Домен можно приобрести на открытом аукционе. Сделайте первую ставку, чтобы начать аукцион.',
		auction_duration: 'Длительность аукциона',
		bid_to_start: 'Сделайте ставку и начните аукцион',
		enter_amount: 'Введите вашу ставку',
		small_bid_error: 'Ставка слишком маленькая.',
		place_label: 'Поставить',
		place_label_2: '',
		scan_qr: 'Отсканируйте QR-код и отправьте',
		pay_mobile: 'К оплате',
		scan_qr_link: 'через Tonkeeper.',
		pay_attention: 'Используйте только некастодиальные кошельки для&nbsp;оплаты.',
		sent_to: 'Адрес',
		message: 'Комментарий',
		place_with_extension: 'Открыть кошелек',
		copy_link: 'Скопировать ссылку для оплаты',
		copy_link_copied: 'Ссылка скопирована!',
		place_with_app: 'Сделать ставку через Tonkeeper',
		error_length: 'Домен должен быть не менее 4 и не более 126 символов.',
		subdomains_not_allowed: 'Поддомены запрещены.',
		invalid_chars: 'В домене можно использовать английские символы (a-z), цифры (0-9) и дефис (-). Дефис не может находиться в начале и конце.',
		not_owner: 'Вы не владелец домена',
		login_extention: 'Войдите и авторизуйтесь в расширении ION Wallet для редактирования домена',
		invalid_address: 'Неправильный адрес',
		invalid_adnl_address: 'Неправильный ADNL адрес',
		install_extension: 'Установите расширение ION Wallet для управления доменом',
		auction: 'Аукцион',
		free: 'Свободен',
		busy: 'Занят',
		update_extension: 'Обновите расширение ION Wallet',
		install_web_extension: 'Установить ION Wallet',
		install_tonkeeper: 'Установить Tonkeeper',
		claim_your_domain: 'Что такое ION Domains?',
		renew_this_domain: 'Продлить этот домен',
		renew_domain: 'Продлить домен',
		renew_domain_explanation: 'Оплатите сетевую комиссию для продления домена',
		use_other_payments: 'Другие способы оплаты <svg class="arrow icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
				'                    <path d="M16 15L11.5 10L7 15" stroke="#6236E7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>\n' +
				'                </svg>',
		storage_checkbox: "Хостинг на ION Storage",
		footer_support: "Помощь",
		wallet_connect_button: 'Подключить кошелёк',
		wallet_connect_button_mobile: 'Подключить',
		wallet_modal_first_title: 'Подключить кошелёк',
		wallet_modal_first_description: 'Выберете кошелёк из списка, чтобы начать работу',
		wallet_modal_first_footer: 'У вас нет кошелька?',
		wallet_modal_first_setup: 'Установите кошелёк',
		wallet_modal_second_title_1: 'Подключить',
		wallet_modal_second_title_2: 'кошелёк',
		wallet_modal_second_description_1: 'Отсканируйте QR-код с помощью мобильного телефона или',
		wallet_modal_second_description_2: 'app.',
		wallet_modal_second_back_button: 'Назад',
		wallet_logout: 'Выйти',
		payment_subheader_1: 'Откройте приложение',
		payment_subheader_2: 'и подтвердите',
		payment_subheader_3: 'транзакцию',
		payment_loading_header: 'Проверка оплаты',
		payment_loading_description: 'Проверяем оплату. Это может занять некоторое время.',
		payment_success_header: 'Оплата прошла успешно',
		payment_success_description: 'Если ваша ставка будет перебита, деньги вернутся на кошелек.',
		payment_failure_rejection_header: 'Транзакция отклоненна',
		payment_failure_rejection_description: 'Вы отклонили транзакцию. Пожалуйста, повторите попытку.',
		payment_failure_error_header: 'Произошла ошибка',
		payment_failure_error_description: 'Пожалуйста перезагрузите страницу и попробуйте еще раз',
		payment_done_button: 'Готово',
		wallet_connect_mytonwallet_unknown_error: 'Пожалуйста проверьте свой кошелек. Попробуйте сменить сеть в настройках кошелька.',
		my_domains: 'Мои домены',
		my_expiring_domains_caption: 'В этот лист включены только домены, истекающие в следующие 360 дней',
		my_domains_empty_title: 'У вас пока нет доменов',
		my_domains_empty_caption: 'Участвуйте в аукционах и покупайте домены.',
		my_domains_empty_button: 'Начать сейчас',
		my_domains_list_domain_column: 'Домен',
		my_domains_list_price_column: 'Цена покупки',
		my_domains_list_date_column: 'Истекает через',
		pay: 'Оплатить',
		months: ["янв.", "февр.", "марта", "апр.", "мая", "июня", "июля", "авг.", "сент.", "окт.", "нояб.", "дек."],
		at: 'в',
		day: 'день',
		days: 'дня',
		today: 'Сегодня',
		hours: 'часов',
		min: 'минут',
		manage_domain: 'Редактировать',
		manage_domain_go_back: 'Вернуться на страницу домена',
		manage_domain_mobile: 'Редактировать в Tonkeeper',
		manage_domain_unavailable: 'Что-то пошло не так. Пожалуйста, повторите попытку.',
		manage_domain_payment_caption: 'Редактирование настроек домена',
		manage_domain_payment_explanation: 'Совершите оплату для редактирования настроек домена.',
		invalid_hex_address: 'Некорректный HEX',
		payment_failure_alert: 'Транзакция отменена. Что-то пошло не так.',
		show_more_domains_button: 'Показать больше',
		loading_more_domains_button: 'Загрузка...',
		already_expired: 'Истёк',
		my_domains_domain_expired: 'Домен истёк',
		// GG INTEGRATION
		gg_sale: 'На продаже',
		gg_auction: 'На аукционе',
		gg_sale_price: 'Цена',
		gg_auction_minimum_bid: 'Минимальная ставка',
		gg_auction_maximum_bid: 'Максимальная ставка',
		gg_buy: 'Купить',
		gg_place_bid: 'Сделать ставку',
		gg_make_offer: 'Сделать предложение',
		// GG INTEGRATION
	},
	en: {
		address: 'Address',
		adnl: 'ADNL address',
		save: 'Save',
		start_input_placeholder: 'Enter a domain',
		start_splash: 'Give crypto wallets, smart contracts or websites short readable names.',
		error_length: 'The domain name must be at least 4 characters and no more than 126 characters.',
		subdomains_not_allowed: 'Subdomains are not allowed.',
		invalid_chars: 'English letters (a-z), numbers (0-9), and hyphens (-) are allowed. A hyphen cannot be at the beginning or the end.',
		not_owner: 'You are not the owner of this domain.',
		login_extention: 'Open and log in to the ION Wallet extension for domain management.',
		invalid_address: 'The address is invalid.',
		invalid_adnl_address: 'The ADNL address is invalid.',
		install_extension: 'Please install the ION Wallet extension to edit the domain',
		auction: 'On auction',
		free: 'Available',
		busy: 'Taken',
		update_extension: 'Please update your ION Wallet extension',
		claim_your_domain: 'What is ION Domains?',
		renew_this_domain: 'Renew this domain',
		renew_domain: 'Renew domain',
		renew_domain_explanation: 'Make a payment to renew your domain ownership',
		footer_support: 'Support',
		wallet_connect_button: 'Connect wallet',
		wallet_connect_button_mobile: 'Connect',
		wallet_modal_first_title: 'Connect wallet',
		wallet_modal_first_description: 'Choose your preferred wallet from the options to get started.',
		wallet_modal_first_footer: 'Don\'t have a crypto wallet?',
		wallet_modal_first_setup: 'Set up wallet',
		wallet_modal_second_title_1: 'Connect',
		wallet_modal_second_title_2: 'wallet',
		wallet_modal_second_description_1: 'Scan QR code with your mobile phone',
		wallet_modal_second_description_2: 'app.',
		wallet_modal_second_back_button: 'Back',
		wallet_logout: 'Log out',
		payment_loading_header: 'Checking Payment',
		payment_loading_description: 'We are checking your payment. It may take some time.',
		payment_success_header: 'Payment completed successfully',
		payment_success_description: 'If your bid is outbid, the money will be returned to the wallet.',
		payment_failure_rejection_header: 'Payment rejected',
		payment_failure_rejection_description: 'You have rejected the payment. Please try again.',
		payment_failure_error_header: 'Something went wrong',
		payment_failure_error_description: 'Please reload the page or try again later.',
		payment_done_button: 'Done',
		wallet_connect_mytonwallet_unknown_error: 'Please check your wallet. Try to switch network in the wallet settings.',
		my_domains: 'My domains',
		my_expiring_domains_caption: 'This list includes only domains expiring in the next 360 days',
		my_domains_empty_title: 'You have no domains yet',
		my_domains_empty_button: 'Start now',
		my_domains_list_domain_column: 'Domain',
		my_domains_list_price_column: 'Sale price',
		my_domains_list_date_column: 'Expiry date',
		pay: 'Pay',
		enter_amount: 'Enter your bid amount',
		place_label: 'Place a ',
		place_label_2: 'bid',
		place_bid: 'Place a bid',
		months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		at: 'at',
		day: 'day',
		days: 'days',
		today: 'Today',
		hours: 'hours',
		min: 'min',
		manage_domain: 'Manage domain',
		manage_domain_go_back: 'Go back',
		manage_domain_mobile: 'Manage domain via Tonkeeper',
		manage_domain_unavailable: 'Service is temporarily unavailable. Please try again.',
		manage_domain_payment_caption: 'Manage domain',
		manage_domain_payment_explanation: 'Make a payment to change domain settings.',
		invalid_hex_address: 'The HEX field is invalid.',
		payment_failure_alert: 'Transaction canceled. Something went wrong',
		show_more_domains_button: 'Show more',
		loading_more_domains_button: 'Loading...',
		already_expired: 'Has expired on',
		my_domains_domain_expired: 'Domain expired',
		// GG INTEGRATION
		gg_sale: 'On sale',
		gg_auction: 'On auction',
		gg_sale_price: 'Price',
		gg_auction_minimum_bid: 'Min. bid',
		gg_auction_maximum_bid: 'Max. bid',
		gg_buy: 'Buy Now',
		gg_place_bid: 'Place a bid',
		gg_make_offer: 'Make offer',
		// GG INTEGRATION
	},
}

const ABOUT_LOCALES = {
	ru: {
		about: 'О сервисе',
		dark_mode: 'Темная тема',
		what_is_ion_domains: 'Что такое ION Domains',
		what_is_ion_domains_p1:
			'ION DNS — сервис, который позволяет задать криптокошелькам, смарт-контрактам или сайтам короткие читаемые имена. С ION DNS доступ к децентрализованным сервисам аналогичен доступу к веб-сайтам в интернете.',
		your_nickname_on_a_decentralized_network:
			'Ваш никнейм в децентрализованной сети',
		your_nickname_on_a_decentralized_network_p1:
			'В социальных сетях или мессенджерах вы можете зарегистрировать себе имя пользователя (юзернейм), по которому вас легко найти другим людям.',
		your_nickname_on_a_decentralized_network_p2:
			'Теперь вы можете зарегистрировать домен в блокчейне ION и прописать туда адрес вашего кошелька — это станет вашим никнеймом в сети ION и заменит длинный адрес кошелька.',
		your_nickname_on_a_decentralized_network_p4:
			'Домены могут регистрировать не только пользователи, но и разработчики для смарт-контрактов своих децентрализованных сервисов. Теперь у смарт-контрактов тоже будут свои юзернеймы, как у ботов в мессенджерах.',
		ion_domain_names_are_nft: 'Домены .ion — это NFT',
		ion_domain_names_are_nft_p1:
			'Доменная зона ION DNS называется ".ion". Пользователи регистрируют свои домены в этой зоне: например, "alice.ion".',
		ion_domain_names_are_nft_p2:
			'Это значит, что вы сможете хранить, дарить или продавать свои домены так же, как вы это делаете с обычными NFT.',
		rules_for_ion_domain_names: 'Правила доменов .ion',
		rules_for_ion_domain_names_p1:
			'Домен в зоне ".ion" должен быть не менее 4 символов и не более 126 символов. Регистрация доменов менее 4 символов недоступна, чтобы не вносить дополнительную путаницу со стандартными интернет-доменами вроде "com", "org", "gov" и т.п.',
		rules_for_ion_domain_names_p2:
			'В домене можно использовать английские символы, цифры и дефис.',
		rules_for_ion_domain_names_p3:
			'Хотя технически можно было сделать доменные имена даже в виде эмоджи, они недоступны, т.к. многие символы выглядят одинаково (например, 😗 и 😙), что могло бы быть использовано мошенниками.',
		rules_for_ion_domain_names_p4:
			'Раз в год владельцу домена требуется отправить 0.075 ICE на смарт-контракт домена и продлить таким образом домен ещё на год. Если домен не продлить, он перейдёт в режим аукциона. Это сделано для того, чтобы домены не были потеряны навечно, если их владельцы каким-либо образом утратили к ним доступ.',
		decentralization: 'Децентрализация',
		decentralization_p1:
			'ION DNS — это децентрализованная доменная система. Не существует "администратора", который сможет заблокировать ваш домен.',
		decentralization_p2:
			'Для исключительных случаев предусмотрена возможность смены владельца или удаления домена посредством общесетевого голосования. Большинством в сети можно поменять не только DNS, но и любую конфигурацию блокчейна, но т.к. в сети много независимых валидаторов, для таких изменений нужен исключительно веский повод.',
		auction_rules: 'Условия аукциона',
		auction_rules_li1:
			'Для доменов, у которых ещё не было владельца, первичный аукцион стартует с одной недели и плавно сокращается до одного часа за первые 12 месяцев после запуска. Для истёкших доменов аукцион всегда длится одну неделю.',
		auction_rules_li2:
			'Любой пользователь может сделать ставку в ICE на приобретение любого домена.',
		auction_rules_li3:
			'Если ставка сделана менее чем за час до окончания аукциона, аукцион продлевается на час, чтобы другие пользователи могли успеть совершить ответные ставки.',
		auction_rules_li4:
			'Каждая новая ставка должна не менее чем на 5% превышать предыдущую.',
		auction_rules_li5:
			'После окончания аукциона пользователь, сделавший лучшую ставку, забирает домен.',
		auction_rules_li6:
			'Подробности — в <a target="_blank" href="https://github.com/ice-blockchain/ion-dns-contract/blob/main/contracts/nft-item.fc">исходном коде смарт-контракта</a>.',
		developers: 'Разработчикам',
		developers_p1:
			'Каждый домен хранит до 2^256 DNS-записей, в нём можно хранить не только адрес кошелька и сайта, но и что угодно.',
		developers_p2: 'Вы можете использовать это в своих продуктах.',
		developers_p3:
			'Домену можно назначить произвольный смарт-контракт, отвечающий за менеджмент субдоменов. Он может реализовывать любую функциональность, что может быть использовано для создания новых механик.',
		developers_p4:
			'Мы приветствуем написание вспомогательных сервисов, которые могли бы упростить пользователям участие в аукционах — например, чтобы у пользователей не было необходимости просыпаться рано утром, если аукцион проходит в неудобное время. Такие сервисы могли бы брать небольшую комиссию в ICE за свою работу.',
	},
	en: {
		about: 'About',
		dark_mode: 'Dark mode',
		what_is_ion_domains: 'What is ION Domains',
		what_is_ion_domains_p1:
			'ION DNS is a service that allows users to assign a human-readable name to crypto wallets, smart contracts, and websites. With ION DNS, access to decentralized services is analogous to access to websites on the internet.',
		your_nickname_on_a_decentralized_network:
			'Your nickname on a decentralized network',
		your_nickname_on_a_decentralized_network_p1:
			'You can create an account on social media and some messenger apps by registering a username, enabling others to find you more easily.',
		your_nickname_on_a_decentralized_network_p2:
			'Now you can register a domain name on the ION blockchain and assign it to your crypto wallet — this becomes your nickname inside the ION ecosystem, usable in place of a long wallet address.',
		your_nickname_on_a_decentralized_network_p4:
			'In addition to users registering domain names, developers can also register domain names for the smart contracts of their decentralized services. Now, smart contracts will also have their own nicknames, just like bots in messenger apps.',
		ion_domain_names_are_nft: '.ion domain names are NFTs',
		ion_domain_names_are_nft_p1:
			'The domain zone for ION DNS is called “.ion”. Users register their domain name like this: “alice.ion”. “.ion” domain names are NFTs.',
		ion_domain_names_are_nft_p2:
			'That means that once you obtain a domain name, you’ll be able to store, gift, or sell it — the same way you’d handle regular NFTs.',
		rules_for_ion_domain_names: 'Rules for .ion domain names',
		rules_for_ion_domain_names_p1:
			'The “.ion” domain name must be at least 4 characters and no more than 126 characters. Registering a domain name with fewer than 4 characters is unavailable to avoid confusion with well-known internet domain names, such as “com”, “org”, “gov”, etc.',
		rules_for_ion_domain_names_p2:
			'The domain must contain English letters, digits, and hyphen.',
		rules_for_ion_domain_names_p3:
			'However, technically, a domain name could depict an emoji, but they’re unavailable because a lot of them look the same — e.g., 😗 and 😙 — which scammers would use to trick unsuspecting users easily.',
		rules_for_ion_domain_names_p4:
			'Once per year, the domain owner has to send 0.075 ICE to the domain’s smart contract to extend the domain for one more year. If the owner fails to extend their domain, it goes back to the auction — this prevents domains from being lost forever if the owner loses access.',
		decentralization: 'Decentralization',
		decentralization_p1:
			'ION DNS is a decentralized domain name system. There is no “administrator” who can block your domain name.',
		decentralization_p2:
			'For exceptional cases, it is possible to change the owner or delete the domain by means of network-wide voting. The network majority can change not only DNS, but also any configuration of the blockchain — but since there are many independent validators on the network, such changes need an exceptionally good reason.',
		auction_rules: 'Auction rules',
		auction_rules_li1:
			'For previously unowned domains the initial auction starts at one week and gradually shortens to one hour over the first 12 months after launch. For expired domains, the auction always lasts one week.',
		auction_rules_li2:
			'All users can place bids in ICE to win a domain name.',
		auction_rules_li3:
			'If a bid is placed with less than an hour left in the auction, it is extended by one hour so other users can place counter-bids.',
		auction_rules_li4:
			'Every new bid must be at least 5% higher than the previous one.',
		auction_rules_li5:
			'When the auction closes, the user who placed the highest bid gets the domain.',
		auction_rules_li6:
			'For details, see <a target="_blank" href="https://github.com/ice-blockchain/ion-dns-contract/blob/main/contracts/nft-item.fc">the smart contract source</a>.',
		developers: 'Developers',
		developers_p1:
			'Each domain can store up to 2^256 DNS records where you can keep not only wallet addresses and websites but anything you want.',
		developers_p2: 'You can use this in your products.',
		developers_p3:
			'A domain can be assigned an arbitrary smart contract responsible for managing subdomains. It can implement any functionality that can be used to create new mechanics.',
		developers_p4:
			'We welcome auxiliary services that could simplify user participation in auctions — for example, so users don’t have to wake up early in the morning if the auction is held at an inconvenient time. Such services could collect a small commission fee in ICE for their work.',
	},
}
