<script setup lang="ts">
defineProps({
  value: Number,
  row: Number,
  col: Number,
  isMerged: Boolean,
  isNew: Boolean
})
</script>

<template>
  <div
    class="tile"
    :class="[
      `tile-position-${col}-${row}`,
      `tile-${value}`,
      { 'tile-new': isNew, 'tile-merged': isMerged }
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
  transition: 100ms ease-in-out;
  transition-property: transform;

  @for $col from 1 through 4 {
    @for $row from 1 through 4 {
      .tile-position-#{$col}-#{$row} {
        transform: translate($col * 121px, $row * 121px);
      }
    }
  }

  &,
  & .tile-inner {
    width: 107px;
    height: 107px;
    line-height: 116.25px;
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
  }

  @for $i from 1 to 11 {
    .tile-#{$i*$i} .tile-inner {
      background-color: #eee4da;
      box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
    }
  }
}
</style>
