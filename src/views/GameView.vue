<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Game from '@/components/Game.vue'
</script>

<template>
  <div class="container">
    <div>
      <RouterLink :to="{ name: 'home' }">← Home</RouterLink>
    </div>
    <Game />
  </div>
</template>

<style scoped lang="scss">
.container {
  color: #776e65;
}
</style>
