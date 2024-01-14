<script lang="ts">
  import SettingMenuImage from './SettingMenuImage.svelte';

  export let platformId: string = 'local';
</script>

{#if platformId === 'local'}
  <SettingMenuImage imageSrc="/assets/image/stream/mycast.svg" />
{:else if platformId === 'totoro'}
  <SettingMenuImage imageSrc="/assets/image/stream/totoro.svg" />
{:else if platformId === 'afreeca'}
  <SettingMenuImage imageSrc="/assets/image/stream/afreecatv.svg" />
{:else if platformId === 'twitch'}
  <SettingMenuImage imageSrc="/assets/image/stream/twitch.svg" />
{:else if platformId === 'youtube'}
  <SettingMenuImage imageSrc="/assets/image/stream/youtube.svg" />
{:else}
  <SettingMenuImage imageSrc="/assets/image/stream/mycast.svg" />
{/if}
