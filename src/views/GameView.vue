<script setup lang="ts">
import { RouterLink } from 'vue-router'
import GameContainer from '@/components/GameContainer.vue'
</script>

<template>
  <div class="container">
    <div>
      <RouterLink :to="{ name: 'home' }">← Home</RouterLink>
    </div>
    <GameContainer />
  </div>
</template>

<style scoped lang="scss">
.container {
  color: #776e65;
}
</style>
