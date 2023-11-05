<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import type { LocalStreamSource } from '../../app/model/window/Content';
  import LocalStreamContentView from '../../app/view/main/content/LocalStreamContentView.svelte';
  import TotoroStreamContentView from '../../app/view/main/content/TotoroStreamContentView.svelte';

  let hasId: boolean = false;
  let id: string = '';
  let platform: string = 'local';

  $: src = createSource('', id, '');

  onMount(() => {
    let urlParams = $page.url.searchParams;
    hasId = urlParams.has('id');
    id = urlParams.get('id') ?? '';
    platform = urlParams.get('p') ?? 'local';
  });

  function createSource(icon: string, url: string, title: string): LocalStreamSource {
    return { icon, url, title };
  }
</script>

{#if hasId}
  {#if platform === 'local'}
    <LocalStreamContentView {src} />
  {:else if platform === 'totoro'}
    <TotoroStreamContentView {src} />
  {:else}
    <p>error</p>
  {/if}
{:else}
  <p>error</p>
{/if}
