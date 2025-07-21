<script lang="ts">
	import Button from './../components/elements/button/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	// function to redirect to home page
	function backToHome() {
		goto('/cashier', { invalidateAll: true });
	}
</script>

{#snippet error404()}
	<img src="/images/error-ilustration.png" class="h-64" alt="" />
{/snippet}
{#snippet error403()}
	<img src="/images/error-ilustration.png" class="h-64" alt="" />
{/snippet}

{#if page.error}
	<main class="flex h-screen w-full">
		<figure class="my-auto flex w-full flex-col items-center gap-4">
			{#if page.error.message == 'Not Found'}
				{@render error404()}
			{:else}
				<img src="/images/error-ilustration.png" class="h-64" alt="" />
			{/if}
			<h1 class="text-3xl font-semibold">Error {page.error.message}</h1>
			<Button style="mt-4 rounded-full px-6" onclick={backToHome}>Back to Home</Button>
		</figure>
	</main>
{/if}
