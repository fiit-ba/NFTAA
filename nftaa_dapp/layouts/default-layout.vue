<template>
  <n-layout>
    <navbar-component />
    <n-layout-content content-style="padding: 24px;">
      <n-grid x-gap="12" cols="1 l:3" responsive="screen">
        <n-gi offset="0 l:1">
          <slot />
        </n-gi>
        <n-gi>
          <div />
        </n-gi>
      </n-grid>
    </n-layout-content>
    <n-layout-footer>
      <footer-component />
    </n-layout-footer>
  </n-layout>
</template>
<script setup lang="ts">
import { NLayout, NGrid, NGi, NLayoutContent, NLayoutFooter } from 'naive-ui'
import FooterComponent from '~/components/layout/footer-component.vue'
import NavbarComponent from '~/components/layout/navbar-component.vue'
</script>
