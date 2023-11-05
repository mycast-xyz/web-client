<script lang="ts">
  import { MobileUtils } from '../../util/mobile/MobileUtils';
  import DesktopMainPage from './DesktopMainPage.svelte';
  import MobileMainPage from './MobileMainPage.svelte';

  export let privateKey: string;

  let clientWidth: number;
</script>

<div bind:clientWidth>
  {#if MobileUtils.isMobile() || clientWidth < 600}
    <MobileMainPage {privateKey} />
  {:else}
    <DesktopMainPage {privateKey} />
  {/if}
</div>

<style>
  div {
    background-color: blue;
    width: 100%;
    height: 100%;
  }
</style>
