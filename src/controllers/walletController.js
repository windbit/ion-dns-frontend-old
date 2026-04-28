const UserRejectsError = TonConnectSDK.UserRejectsError;

class WalletController {
	constructor(props) {
		this.store = props.store
		this.currentWallet = null

    this.connector = new TonConnectSDK.TonConnect({
      walletsListSource: '/wallets-v2.json',
      walletsListCacheTTLMs: 0
    });
    this.tonConnectUI = new ION_CONNECT_UI.TonConnectUI({
      connector: this.connector,
      buttonRootId: 'connect-wallet-button'
    });

    const currentTheme = themeController.getTheme()
    const locale = store.locale

    this.tonConnectUI.uiOptions = {
      language: locale,
      uiPreferences: {
        theme: UPPER_CASE_THEME[currentTheme],
        colorsSet: COLORS_SET
      },
      actionsConfiguration: {
        modals: [],
        notifications: []
      }
    };

    this.tonConnectUI.onStatusChange((walletInfo) => {
      this.currentWallet = this.tonConnectUI.wallet
    });

    this.tonConnectUI.connectionRestored.then((restored) => {
      if (restored) {
        this.currentWallet = this.tonConnectUI.wallet
      }
    });
  }

  async sendTransaction(
		transaction,
		onPaymentSuccess = () => {},
		onPaymentRejection = () => {},
		onPaymentError = () => {}
	) {
		try {
			await this.tonConnectUI.sendTransaction(transaction)
				.then(() => onPaymentSuccess());

		} catch (e) {
			if (e instanceof UserRejectsError) {
					onPaymentRejection()
			} else {
					onPaymentError()
			}
		}
	}

  updateTheme(theme) {
    this.tonConnectUI.uiOptions = {
      uiPreferences: {
        theme,
      }
    }
  }

  async isLoggedIn() {
		return !!this.tonConnectUI.connected
	}

	isLoggedInSync() {
		return !!this.tonConnectUI.connected
	}

  getCurrentWallet() {
		return this.currentWallet
	}

	getAccountAddressUserFriendly() {
		const { address, chain } = this.currentWallet?.account || {}

		if (!address || !chain) {
			return null
		}

		return this.getUserFriendlyAddress(address, chain)
	}

	getAccountAddress() {
		const { address, chain } = this.currentWallet?.account || {}

		if (!address || !chain) {
			return null
		}

		return address;
	}

  getUserFriendlyAddress(address, chain) {
		if (!address) {
			return '';
		}

		return TonConnectSDK.toUserFriendlyAddress(address, false);
	}

}
