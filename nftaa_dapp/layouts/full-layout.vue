<template>
  <n-layout>
    <navbar-component />
    <n-layout-content content-style="padding: 24px;">
      <n-grid x-gap="12" cols=" 1 m:4" responsive="screen">
        <n-gi offset="0 m:1" span="1 m:2">
          <slot />
        </n-gi>
      </n-grid>
    </n-layout-content>
    <n-layout-footer>
      <footer-component />
    </n-layout-footer>
  </n-layout>
</template>
<script setup lang="ts">
import { NGi, NGrid, NLayout, NLayoutContent, NLayoutFooter } from 'naive-ui'
import FooterComponent from '~/components/layout/footer-component.vue'
import NavbarComponent from '~/components/layout/navbar-component.vue'
</script>
