<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { setUserState } from '$lib/state/user-state.svelte';
	import '../app.css';
	import Footer from '../components/elements/Footer.svelte';
	import Navbar from '../components/elements/Navbar.svelte';

	let { children, data } = $props();
	let { session, supabase, user } = $derived(data);
	let userState = setUserState({
		session: data.session,
		supabase: data.supabase,
		user: data.user
	});
	$effect(() => {
		userState.updateState({ session, supabase, user });
	});
	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
	let hide_navbar = $state(['/login', '/register']);
</script>

<main class="font-inter mx-auto min-h-screen bg-white 2xl:container">
	{#if !hide_navbar.includes(page.url.pathname)}
		<Navbar />
	{/if}
	<main class="min-h-screen">
		{@render children()}
	</main>
	{#if !hide_navbar.includes(page.url.pathname)}
		<footer class="mt-8">
			<Footer />
		</footer>
	{/if}
</main>
