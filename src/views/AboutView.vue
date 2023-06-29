<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const id = ref(0)
const state = reactive({ arr: [{ id: id.value }] })
let intervalId: number

watch(
  () => state.arr.length,
  () => {
    console.log('watch', state)
  },
  {
    immediate: true
  }
)

const handleClick = () => {
  state.arr = state.arr.filter((item) => item.id % 2 === 0)
}

onMounted(() => {
  intervalId = setInterval(() => {
    state.arr.push({ id: ++id.value })
  }, 1000)
})
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'home' }">← Home</RouterLink>
  </div>
  <h1>about</h1>
  <div>{{ state.arr.length }}</div>
  <button @click="handleClick">remove even elements</button>
</template>

<style scoped lang="scss"></style>
