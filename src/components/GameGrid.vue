<script setup lang="ts">
interface GridProps {
  size: number
}

withDefaults(defineProps<GridProps>(), { size: 4 })
</script>

<template>
  <div class="grid-container">
    <div class="grid-row" v-for="(_, i) of Array.from({ length: size })" :key="i">
      <div class="grid-cell" v-for="(_, j) of Array.from({ length: size })" :key="j"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.grid-row {
  margin-bottom: 15px;
  display: flex;
}

.grid-cell {
  width: 106.25px;
  height: 106.25px;
  margin-right: 15px;
  border-radius: 3px;
  background: rgba(238, 228, 218, 0.35);
}
</style>
