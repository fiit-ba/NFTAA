<template>
  <nuxt-layout name="default-layout">
    <n-space vertical>
      <n-card>
        <template #header>
          <n-space align="center" justify="center">
            <h1 style="padding-bottom: 10px">NFTAA by</h1>
            <h2>Roman</h2>
          </n-space>
          <n-divider />
        </template>
        <nftaa-component />
      </n-card>
    </n-space>
    <n-space vertical>
      <span class="filler" />
    </n-space>
  </nuxt-layout>
</template>

<script setup lang="ts">
import { NSpace, NCard, NDivider } from 'naive-ui'
import NftaaComponent from '~~/components/nftaa/nftaa-component.vue'
definePageMeta({
  layout: false,
})
</script>
<style lang="scss" scoped>
.paraspell {
  width: 180px;
}
</style>
