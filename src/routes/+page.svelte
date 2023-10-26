<script lang="ts">
	import { onMount } from 'svelte';
	import { SessionService } from '../app/service/SessionService';
	import LoginPage from '../app/view/login/LoginPage.svelte';
	import MainPage from '../app/view/main/MainPage.svelte';
	import ToastList from '../app/view/toast/ToastList.svelte';

	let userHash: string | null = null;

	onMount(() => {
		SessionService.subscribePrivateKey((v) => (userHash = v));
	});
</script>

<main>
	{#if userHash !== null && userHash.length > 0}
		<MainPage privateKey={userHash} />
	{:else}
		<LoginPage />
	{/if}
	<div class="toast-layer">
		<ToastList />
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}

	.toast-layer {
		position: fixed;
		width: 0;
		height: 0;
		z-index: 100;
	}
</style>
