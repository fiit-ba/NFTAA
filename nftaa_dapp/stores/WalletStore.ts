/* eslint no-unused-vars: 0 */
import { defineStore } from 'pinia'
import {
  WalletController,
  WalletControllerState,
} from '~~/evm/WalletController'
import { SubScaffoldChainId } from '~/evm/chain'

// if changing here, also change in actions bellow
export enum WalletActionType {
  reloadNativeBalance = 'reloadNativeBalance',
}

export interface WalletState {
  chainId: SubScaffoldChainId | null
  provider: unknown | null
  selectedAddress: string | null
  state: WalletControllerState
  wallet: WalletController | null
}

export const useWalletStore = defineStore('walletStore', {
  // if changing here, also change in enum WalletActionType above
  actions: {
    // eslint-disable-next-line
		reloadNativeBalance() {}
  },
  state: (): WalletState => {
    return {
      chainId: null,
      provider: null,
      selectedAddress: null,
      state: 'notConnected',
      wallet: null,
    }
  },
})
