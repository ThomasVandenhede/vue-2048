<script setup lang="ts">
interface TileProps {
  col: number
  row: number
  value: number
  isMerged?: boolean
  isNew?: boolean
}

withDefaults(defineProps<TileProps>(), {
  isMerged: false,
  isNew: false
})
</script>

<template>
  <div
    class="tile"
    :class="[
      `tile-position-${col}-${row}`,
      `tile-${value}`,
      {
        'tile-super': value > Math.pow(2, 11),
        'tile-new': isNew,
        'tile-merged': isMerged
      }
    ]"
  >
    <div class="tile-inner">{{ value }}</div>
  </div>
</template>

<style scoped lang="scss">
@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.tile {
  position: absolute;
  transition: inherit;

  @for $col from 1 through 12 {
    @for $row from 1 through 12 {
      &.tile-position-#{$col}-#{$row} {
        transform: translate(($col - 1) * 121px, ($row - 1) * 121px);
      }
    }
  }

  &,
  & .tile-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 107px;
    height: 107px;
  }
}

.tile-inner {
  border-radius: 3px;
  background: #eee4da;
  text-align: center;
  font-weight: 700;
  z-index: 10;
  font-size: 55px;

  .tile-new & {
    animation: appear 200ms ease 100ms;
    animation-fill-mode: backwards;
  }

  .tile-merged & {
    animation: pop 200ms ease 100ms;
    animation-fill-mode: backwards;
  }

  .tile-2 & {
    color: rgb(119, 110, 101);
    background-color: #eee4da;
    box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    font-size: 53px;
  }
  .tile-4 & {
    color: rgb(119, 110, 101);
    background-color: rgb(237, 224, 200);
    box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    font-size: 53px;
  }
  .tile-8 & {
    color: rgb(249, 246, 242);
    background-color: rgb(242, 177, 121);
    box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    font-size: 53px;
  }
  .tile-16 & {
    color: rgb(249, 246, 242);
    background-color: rgb(245, 149, 99);
    box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    font-size: 53px;
  }
  .tile-32 & {
    color: rgb(249, 246, 242);
    background-color: rgb(246, 124, 95);
    box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    font-size: 53px;
  }
  .tile-64 & {
    color: rgb(249, 246, 242);
    background-color: rgb(246, 94, 59);
    box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    font-size: 53px;
  }
  .tile-128 & {
    color: rgb(249, 246, 242);
    background-color: rgb(237, 207, 114);
    box-shadow: rgba(243, 215, 116, 0.24) 0px 0px 30px 10px,
      rgba(255, 255, 255, 0.14) 0px 0px 0px 1px inset;
    font-size: 45px;
  }
  .tile-256 & {
    color: rgb(249, 246, 242);
    background-color: rgb(237, 204, 97);
    box-shadow: rgba(243, 215, 116, 0.318) 0px 0px 30px 10px,
      rgba(255, 255, 255, 0.192) 0px 0px 0px 1px inset;
    font-size: 45px;
  }
  .tile-512 & {
    color: rgb(249, 246, 242);
    background-color: rgb(237, 200, 80);
    box-shadow: rgba(243, 215, 116, 0.396) 0px 0px 30px 10px,
      rgba(255, 255, 255, 0.24) 0px 0px 0px 1px inset;
    font-size: 45px;
  }
  .tile-1024 & {
    color: rgb(249, 246, 242);
    background-color: rgb(237, 197, 63);
    box-shadow: rgba(243, 215, 116, 0.475) 0px 0px 30px 10px,
      rgba(255, 255, 255, 0.286) 0px 0px 0px 1px inset;
    font-size: 35px;
  }
  .tile-2048 & {
    color: rgb(249, 246, 242);
    background-color: #edc22e;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556),
      inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
    font-size: 35px;
  }

  .tile-super & {
    color: #f9f6f2;
    background: #3c3a32;
    font-size: 30px;
  }
}
</style>
