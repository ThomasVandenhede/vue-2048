<script setup lang="ts">
import Game from '@/components/Game.vue'
</script>

<template>
  <h1>Welcome!</h1>
  <nav>
    <RouterLink :to="{ name: 'game' }">Vue.js 2048</RouterLink>
    <RouterLink :to="{ name: 'about' }">About</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  flex-direction: column;

  a {
    margin: 0.25rem 0;
  }
}
</style>
