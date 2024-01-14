<script lang="ts">
  import TextSettingInput from './TextSettingInput.svelte';

  export let streamKey: string;
  export let significant: string;
</script>

<TextSettingInput
  title="스트림 키"
  subtitle="STREAM KEY"
  bind:value={streamKey}
  bind:significant
  name="stream-key"
/>
