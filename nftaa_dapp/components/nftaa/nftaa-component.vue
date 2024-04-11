<template>
  <n-space vertical>
    <n-alert title="Current support" type="info">
      Currently supported chains for NFTAA: &nbsp;
      <code>{{ 'Moonbase Alpha TestNet' }}</code>
    </n-alert>
    <n-alert
      v-if="!isWalletConnected"
      title="Connect your account"
      type="error"
    >
      You haven't connect any wallet. Please connect your wallet via Metamask to
      continue with NFTAA process.
    </n-alert>
    <n-alert v-else title="Your account" type="info">
      Your current account: &nbsp;
      <code>{{ selectedAddressAbbr }} </code>
    </n-alert>

    <n-form v-if="isWalletConnected">
      <collection-select
        :selected-collection="selectedCollection"
        @change="
          (val) => {
            selectedCollection = val
            $el.ownerDocument.defaultView.console.log(val)
          }
        "
      />
      <n-space v-if="selectedCollection !== null" vertical>
        <n-space justify="space-between">
          <n-button @click="setCall('stake', false)"> Stake </n-button>
          <n-button @click="setCall('addToStake', false)">
            Add to stake
          </n-button>
          <n-button @click="setCall('unStake', true)"> Unstake </n-button>
          <n-button @click="setCall('getStakedAmount', true)">
            Get balance
          </n-button>
          <n-button @click="setCall('getStaker', true)"> Get staker </n-button>
          <n-space horizontal>
            <n-button @click="setCall('mint', false)"> Mint </n-button>
            <n-button @click="setCall('transfer', false)"> Transfer </n-button>
          </n-space>
        </n-space>

        <n-input
          v-if="call === 'mint' || call === 'transfer'"
          v-model:value="description"
          type="text"
          :placeholder="
            call === 'transfer' ? 'Target addr' : 'NFTAA Description'
          "
        />

        <n-input-number
          v-if="call !== 'mint'"
          v-model:value="messageValue"
          :min="0"
          :placeholder="call === 'transfer' ? 'Token ID' : 'Message value'"
          :disabled="isDisable"
        />
        <n-space vertical align="center">
          <n-button ghost color="#8a2be2" @click="send()">
            <template #icon>
              <n-icon>
                <cash-icon class="send" />
              </n-icon>
            </template>
            Send
          </n-button>
        </n-space>
      </n-space>
    </n-form>
  </n-space>
</template>

<script lang="ts" setup>
import { computed, ComputedRef } from 'vue'
import { CashOutline as CashIcon } from '@vicons/ionicons5'
import { NAlert, NSpace, NButton, NInputNumber, NInput } from 'naive-ui'
import { storeToRefs } from 'pinia'
import CollectionSelect from '~/components/nftaa/collection-select.vue'
import { useWalletStore } from '~/stores/WalletStore'
import { getAddressAbbr } from '~/evm/utils'
import { COLLECTION_OF_NFTAA, NFTAA_ADDRESS } from '~~/evm/constants'
import { useNftaa } from '~/composables/useNftaa'

const walletStoreData = storeToRefs(useWalletStore())
const selectedCollection = ref<number | null>(null)
const messageValue = ref<string | null>(null)
const call = ref<string | null>(null)
const isDisable = ref<boolean>(true)

const description = ref<string>('')

const isWalletConnected: ComputedRef<boolean> = computed(
  () => walletStoreData.state.value === 'connected'
)

const selectedAddressAbbr: ComputedRef<string> = computed(() =>
  getAddressAbbr(walletStoreData.selectedAddress.value ?? '')
)

function getCollectionAddress() {
  if (selectedCollection.value !== null) {
    return COLLECTION_OF_NFTAA[selectedCollection.value].contractAddress
  }
  return ''
}

function setCall(wantedCall: string, disable: boolean) {
  call.value = wantedCall
  isDisable.value = disable
}

async function send() {
  if (useWalletStore().provider !== null) {
    const {
      getStakedAmount,
      getStaker,
      stake,
      addToStake,
      unStake,
      mint,
      transferTo,
    } = useNftaa()

    if (call.value === 'getStakedAmount') {
      messageValue.value = await getStakedAmount(NFTAA_ADDRESS)
    } else if (call.value === 'getStaker') {
      messageValue.value = await getStaker(NFTAA_ADDRESS)
    } else if (call.value === 'stake') {
      if (messageValue.value !== null) {
        await stake(messageValue.value, NFTAA_ADDRESS)
        messageValue.value = '0'
      }
    } else if (call.value === 'addToStake') {
      if (messageValue.value !== null) {
        await addToStake(messageValue.value, NFTAA_ADDRESS)
        messageValue.value = '0'
      }
    } else if (call.value === 'unStake') {
      await unStake(NFTAA_ADDRESS)
      messageValue.value = '0'
    } else if (call.value === 'mint') {
      await mint(description.value)
      call.value = ''
      description.value = ''
      messageValue.value = ''
    } else if (call.value === 'transfer') {
      if (
        walletStoreData.selectedAddress.value &&
        messageValue.value !== null
      ) {
        await transferTo(
          walletStoreData.selectedAddress.value,
          description.value,
          Number(messageValue.value)
        )
        call.value = ''
        description.value = ''
        messageValue.value = ''
      }
    }
  }
}
</script>

<style>
.send {
  width: 100%;
  height: 100%;
}
</style>
