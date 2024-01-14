<script lang="ts">
  import TextSettingInput from './TextSettingInput.svelte';

  export let streamKey: string;
  export let title: string = '스트림 키';
  export let subtitle: string = 'STREAM KEY';
</script>

<TextSettingInput {title} {subtitle} bind:value={streamKey} name="stream-key">
  <slot name="significant" slot="significant" />
</TextSettingInput>
