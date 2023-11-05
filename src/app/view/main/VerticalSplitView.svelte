<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    offsetchange: { offset: number; side: 'left' | 'right' };
  }>();

  export let minSideSize: number;
  export let offset = 300;
  export let side: 'left' | 'right';

  let isMoveMode = false;
  let clientWidth: number;
  $: dividerOffset = side === 'left' ? offset : clientWidth - offset;
  $: minX = minSideSize;
  $: maxX = clientWidth - minSideSize;
  $: sideLeft = side === 'left' ? '0' : 'auto';
  $: sideRight = side === 'left' ? 'auto' : '0';
  $: {
    dispatch('offsetchange', { offset, side: side });
  }

  const onDividerMove = (e: MouseEvent) => {
    if (isMoveMode) {
      let movingOffset = trimPosition(e.clientX, minX, maxX);
      if (movingOffset < clientWidth / 2) {
        side = 'left';
        offset = movingOffset;
      } else {
        side = 'right';
        offset = clientWidth - movingOffset;
      }
    }
  };

  const trimPosition = (pos: number, min: number, max: number): number => {
    const trimmedStart = (a: number, b: number) => (a > b ? a : b);
    const trimmedEnd = (a: number, b: number) => (a < b ? a : b);
    return trimmedStart(trimmedEnd(pos, max), min);
  };
</script>

<div class="container" bind:clientWidth>
  <div
    class="divided"
    style="left: {sideRight}; right: {sideLeft}; width: calc(100% - {offset}px);"
  >
    <slot name="main" />
  </div>
  <div class="divided" style="left: {sideLeft}; right: {sideRight}; width: {offset}px;">
    <slot name="side" />
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="divider"
    class:active={isMoveMode}
    style="left: {dividerOffset}px;"
    on:mousedown={(_) => (isMoveMode = true)}
    on:mousemove={onDividerMove}
    on:mouseup={(_) => (isMoveMode = false)}
  />
</div>

<style lang="scss">
  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .divided {
    position: absolute;
    height: 100%;
  }

  .divider {
    position: absolute;
    top: 0;
    width: 10px;
    height: 100%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    cursor: col-resize;

    &.active {
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      transform: none;
      -webkit-transform: none;
    }
  }
</style>
