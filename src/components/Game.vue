<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Grid from './Grid.vue'
import Tile from './Tile.vue'
import { setCssVariable } from '@/utils/cssVariable'
import { useGameStore } from '@/stores/game'
import { GRID_SIZE } from '@/constants'

const { state, move } = useGameStore()
const containerRef = ref<HTMLElement | null>(null)

const forceReflow = (el: HTMLElement) => el.offsetHeight

const handleKeyDown = (event: KeyboardEvent) => {
  const container = containerRef.value
  if (container) {
    container.style.transition = 'none'
    forceReflow(container)
    container.style.transition = ''

    switch (event.key) {
      case 'ArrowUp':
        move('up')
        break
      case 'ArrowDown':
        move('down')
        break
      case 'ArrowRight':
        move('right')
        break
      case 'ArrowLeft':
        move('left')
        break
      default:
        break
    }
  }
}

watch(
  () => state.tiles,
  () => {
    console.log('watch', state)
  },
  {
    deep: true
  }
)

onMounted(() => {
  setCssVariable('--grid-size', GRID_SIZE)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="game-container">
    <Grid :size="GRID_SIZE" />
    <div class="tile-container" ref="containerRef">
      <Tile
        v-for="tile of state.tiles"
        :key="tile.id"
        :value="tile.value"
        :col="tile.col"
        :row="tile.row"
        :is-merged="Boolean(tile.mergedFrom)"
        :is-new="tile.isNew"
      />
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

.tile-container {
  position: absolute;
  transition: all 100ms ease-in-out;
  z-index: 2;
}
</style>
