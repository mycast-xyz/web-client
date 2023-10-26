<script lang="ts">
	import { onMount } from 'svelte';
	import { ThemeService } from '../app/service/ThemeService';

	onMount(() => {
		ThemeService.init();
	});
</script>

<slot />
