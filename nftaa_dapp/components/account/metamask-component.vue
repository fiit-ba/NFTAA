<template>
  <n-button @click="connect">
    <span v-if="isWalletConnected">
      {{ selectedAddressAbbr }}
      <br />
      {{ balance }} {{ selectedChain?.asset.symbol }}
    </span>
    <slot v-else>Connect your account</slot>
  </n-button>
</template>
<script setup lang="ts">
import { NButton } from 'naive-ui'
import { computed, ComputedRef, ToRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Big from 'big.js'
import { MetamaskController } from '~/evm/MetamaskController'
import { useWalletStore, WalletState } from '~~/stores/WalletStore'
import { EVM_NATIVE_DECIMALS } from '~/evm/constants'
import { fromSmallestUnit, getAddressAbbr } from '~/evm/utils'
import { CHAIN_INFO, ChainData } from '~/evm/chain'

const store = useWalletStore()
const walletStoreData: ToRefs<WalletState> = storeToRefs(useWalletStore())

onMounted(() => {
  const store = useWalletStore()
  store.$onAction((data) => {
    if (data.name === WalletActionType.reloadNativeBalance) {
      setBalanceOfSelectedAddress()
    }
  })
})

const selectedAddressAbbr: ComputedRef<string> = computed(() =>
  getAddressAbbr(walletStoreData.selectedAddress.value ?? '')
)

const balance: Ref<string> = ref('')
const setBalanceOfSelectedAddress = (): void => {
  const store = useWalletStore()
  if (store.wallet !== null && store.selectedAddress !== null) {
    store.wallet.getBalanceOfSelectedAddress().then((result: string) => {
      result = fromSmallestUnit(result, EVM_NATIVE_DECIMALS)
      // display max 4 decimal places
      balance.value = new Big(result).round(4).toString()
    })
  }
}

setBalanceOfSelectedAddress()
watch(walletStoreData.selectedAddress, setBalanceOfSelectedAddress)
watch(walletStoreData.chainId, setBalanceOfSelectedAddress)

const chains: { [chainId: number]: ChainData } = CHAIN_INFO
const selectedChain: ComputedRef<ChainData | null> = computed(() => {
  if (walletStoreData.chainId.value !== null) {
    return chains[walletStoreData.chainId.value]
  } else {
    return null
  }
})

const isWalletConnected: ComputedRef<boolean> = computed(
  () => walletStoreData.state.value === 'connected'
)

const connect = (): void => {
  const metamaskController: MetamaskController = new MetamaskController()

  store.wallet = metamaskController
  metamaskController.init()
  store.wallet.enable()
}
</script>
