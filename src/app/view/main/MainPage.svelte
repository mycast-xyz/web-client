<script lang="ts">
  import DesktopMainPage from './DesktopMainPage.svelte';

  export let privateKey: string;
</script>

<DesktopMainPage {privateKey} />
