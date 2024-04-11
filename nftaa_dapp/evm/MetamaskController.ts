/* eslint dot-notation: 0 */
import {
  WalletController,
  WalletControllerState,
} from '~~/evm/WalletController'
import { CHAIN_INFO, SubScaffoldChainId } from '~~/evm/chain'
import {
  METAMASK_CHAIN_NOT_ADDED_ERROR,
  EVM_NATIVE_DECIMALS,
} from '~~/evm/constants'
import { useWalletStore } from '~~/stores/WalletStore'
import { decToHex, hexToDec } from '~/evm/utils'

export class MetamaskController implements WalletController {
  chainId: SubScaffoldChainId | null = null
  selectedAddress: string | null = null
  state: WalletControllerState = 'notConnected'

  private async checkInitialIsConnected() {
    if (await this.isConnected()) {
      await this.setState('connected')
    }
  }

  private async checkIsInstalled() {
    // @ts-ignore
    if (typeof window['ethereum'] === 'undefined') {
      await this.setState('notInstalled')
    }
  }

  private async getChainId(): Promise<SubScaffoldChainId> {
    // @ts-ignore
    const chainId: string = await window['ethereum'].request({
      method: 'eth_chainId',
    })
    return Number(hexToDec(chainId))
  }

  private hookToAccountChanged() {
    // @ts-ignore
    window['ethereum'].on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length !== 0) {
        this.setSelectedAddress(accounts[0])
        await this.setState('connected')
      } else {
        await this.setState('notConnected')
      }
    })
  }

  private hookToChainChanged() {
    // @ts-ignore
    window['ethereum'].on('chainChanged', (chainId: string) => {
      this.setChainId(Number(hexToDec(chainId)))
    })
  }

  private hookToEvents() {
    if (this.state !== 'notInstalled') {
      this.hookToAccountChanged()
      this.hookToChainChanged()
    }
  }

  private async isConnected(): Promise<boolean> {
    if (this.state === 'notInstalled') {
      return Promise.resolve(false)
    }

    // @ts-ignore
    const accounts: string[] = await window['ethereum'].request({
      method: 'eth_accounts',
    })
    if (accounts.length !== 0) {
      this.setSelectedAddress(accounts[0])
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }

  private setChainId(chainId: SubScaffoldChainId) {
    if (this.chainId === chainId) {
      return
    }

    this.chainId = chainId
    const store = useWalletStore()
    store.chainId = chainId
  }

  private setSelectedAddress(selectedAddress: string) {
    if (this.selectedAddress === selectedAddress) {
      return
    }

    this.selectedAddress = selectedAddress
    const store = useWalletStore()
    store.selectedAddress = selectedAddress
  }

  private async setState(state: WalletControllerState) {
    if (this.state === state) {
      return
    }

    const store = useWalletStore()
    store.state = state

    if (this.state === 'notConnected' && state === 'connected') {
      this.setChainId(await this.getChainId())
      // @ts-ignore
      store.provider = window['ethereum']
    }

    this.state = state
  }

  async addChain(chainId: SubScaffoldChainId) {
    // @ts-ignore
    await window['ethereum'].request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          blockExplorerUrls: [CHAIN_INFO[chainId].explorerLink],
          chainId: decToHex(chainId.toString()),
          chainName: CHAIN_INFO[chainId].name,
          nativeCurrency: {
            decimals: EVM_NATIVE_DECIMALS,
            name: CHAIN_INFO[chainId].asset.name,
            symbol: CHAIN_INFO[chainId].asset.symbol,
          },
          rpcUrls: [CHAIN_INFO[chainId].rpcUrl],
        },
      ],
    })
  }

  enable() {
    if (this.state === 'notInstalled' || this.state === 'connected') {
      return
    }

    // @ts-ignore
    window['ethereum'].request({ method: 'eth_requestAccounts' })
  }

  async getBalanceOfSelectedAddress(): Promise<string> {
    return hexToDec(
      // @ts-ignore
      await window['ethereum'].request({
        method: 'eth_getBalance',
        params: [this.selectedAddress, 'latest'],
      })
    )
  }

  async init() {
    await this.checkIsInstalled()
    await this.checkInitialIsConnected()
    this.hookToEvents()
  }

  async switchChain(chainId: SubScaffoldChainId) {
    try {
      // @ts-ignore
      await window['ethereum'].request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: decToHex(chainId.toString()) }],
      })
    } catch (e: unknown) {
      // try to add chain to metamask
      // @ts-ignore
      if (e.code === METAMASK_CHAIN_NOT_ADDED_ERROR) {
        await this.addChain(chainId)
      }
    }
  }

  /*
  watchAsset(asset: TokenListItem, type: ERC_TYPE = 'ERC20') {
    // @ts-ignore
    window['ethereum'].request({
      method: 'wallet_watchAsset',
      params: {
        options: {
          address: asset.address,
          decimals: asset.decimals,
          image: asset.logoURI,
          symbol: asset.symbol,
        },
        type,
      },
    })
  }
	 */
}
