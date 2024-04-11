import { SubScaffoldChainId } from '~~/evm/chain'

export type WalletControllerState =
  | 'notConnected'
  | 'notInstalled'
  | 'error'
  | 'connected'

export interface WalletController {
  addChain?: (chainId: SubScaffoldChainId) => void
  enable: () => void
  init: () => void
  chainId: SubScaffoldChainId | null
  getBalanceOfSelectedAddress: () => Promise<string>
  selectedAddress: string | null
  state: WalletControllerState
  switchChain: (chainId: SubScaffoldChainId) => void
}
