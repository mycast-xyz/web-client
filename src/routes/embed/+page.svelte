<script lang="ts">
	import { page } from '$app/stores';

	import type { LocalStreamSource } from '../../app/model/window/Content';
	import LocalStreamContentView from '../../app/view/main/content/LocalStreamContentView.svelte';
	import TotoroStreamContentView from '../../app/view/main/content/TotoroStreamContentView.svelte';

	const urlParams = $page.url.searchParams;
	const hasId = urlParams.has('id');
	const id = urlParams.get('id') ?? '';
	const platform = urlParams.get('p');

	let src: LocalStreamSource = {
		icon: '',
		url: id,
		title: ''
	};
</script>

{#if hasId}
	{#if platform === 'local'}
		<LocalStreamContentView {src} />
	{:else if platform === 'totoro'}
		<TotoroStreamContentView {src} />
		totoro
	{:else}
		<p>error</p>
	{/if}
{:else}
	<p>error</p>
{/if}
