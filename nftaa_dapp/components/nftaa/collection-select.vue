<template>
  <n-form-item label="Select collection">
    <n-select
      v-model:value="selectedCollection"
      :options="options"
      class="type-select"
      placeholder="Select NFTAA collection"
      filterable
      clearable
      @clear="$emit('clear')"
    />
  </n-form-item>
</template>
<script lang="ts" setup>
import { NFormItem, NSelect, type SelectOption } from 'naive-ui'
import { COLLECTION_OF_NFTAA } from '~~/evm/constants'
const $emit = defineEmits(['change', 'clear'])

const options: SelectOption[] = [
  { label: COLLECTION_OF_NFTAA[0].name, value: COLLECTION_OF_NFTAA[0].id },
]

const selectedCollection = ref<number | null>(null)

watch(
  () => selectedCollection.value,
  (val) => $emit('change', val)
)
</script>
<style lang="scss" scoped>
.asset-select {
  width: 100%;
}
</style>
