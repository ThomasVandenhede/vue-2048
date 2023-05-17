<script setup lang="ts">
import { onMounted } from 'vue'
import Grid from './Grid.vue'
import Tile from './Tile.vue'

import { setCssVariable } from '../utils/cssVariable'

const GRID_SIZE = 5
onMounted(() => {
  setCssVariable('--grid-size', GRID_SIZE)
})
</script>

<template>
  <div class="game-container">
    <Grid :size="GRID_SIZE" />
    <div class="tile-container">
      <Tile :value="2" :col="1" :row="1" :is-merged="false" :is-new="false" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-container {
  margin-top: 25px;
}

.game-container {
  position: relative;
  padding: var(--padding);
  cursor: default;
  touch-action: none;
  background: #bbada0;
  border-radius: 6px;
  width: calc(var(--grid-size) * var(--cell-size) + (var(--grid-size) + 1) * var(--padding));
  height: calc(var(--grid-size) * var(--cell-size) + (var(--grid-size) + 1) * var(--padding));
  box-sizing: border-box;
}
</style>
