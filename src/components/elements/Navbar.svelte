<script lang="ts">
	import { page } from '$app/state';
	import menu_navbar from '$lib/constants/menu-navbar.json';
	import { getUserState } from '$lib/state/user-state.svelte';
	import { slide } from 'svelte/transition';
	import Button from './button/Button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import Logout from './icons/Logout.svelte';
	import { goto } from '$app/navigation';
	let scrolled = $state(false);
	let currentPage = $derived(page.url.pathname);
	let userContext = getUserState();
	let { user } = $derived(userContext);

	let userName = $derived(user?.user_metadata.full_name);
	let userEmail = $derived(user?.email);
	let userProfile = $derived(user?.user_metadata.avatar_url);
	let userRole = $derived(user?.user_metadata.role);
	// $inspect(user);
	let openProfile = $state(false);

	function toggleProfile() {
		openProfile = !openProfile;
	}

	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 0;
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // run awal

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function logout() {
		userContext.logout();
		window.location.href = '/';
	}
</script>

<nav
	class="sticky top-0 z-50 flex items-center justify-between px-4 py-2 transition-all duration-300 md:px-8 md:py-5 {scrolled
		? 'bg-white/70  shadow-xs backdrop-blur-md'
		: 'bg-transparent'}"
>
	<figure class="max-md:hidden">
		<img src="/images/reporthat-logo.png" class="h-10" alt="" />
	</figure>
	<div class="flex items-center gap-4 max-md:w-full max-md:justify-between">
		<ul class="bg-light-300 flex items-center gap-4 rounded-full p-2 font-semibold">
			{#each menu_navbar as _}
				<a
					data-sveltekit-preload-data
					class:selected={currentPage === _.url}
					class="rounded-full px-4 py-1 text-xs hover:text-amber-500 md:text-sm"
					href={_.url}>{_.name}</a
				>
			{/each}
		</ul>
		{#if user}
			<div class="relative inline-block text-left">
				<!-- Profile Icon -->

				<button
					onclick={toggleProfile}
					class="border-light-300 flex items-center gap-2 rounded-full border-3 bg-white px-3 py-1 pl-1 transition hover:bg-gray-100"
				>
					<img
						src={userProfile}
						alt="profile"
						class="h-8 w-8 rounded-full object-cover md:h-9 md:w-9"
					/>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 md:h-5" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 17h14M5 12h14M5 7h14"
						/></svg
					>
				</button>

				<!-- Dropdown -->
				{#if openProfile}
					<div
						transition:slide
						class=" absolute right-0 mt-2 w-max min-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xs"
					>
						<h2 class="text-dark-700 px-2 text-xs md:text-sm">Sedang menggunakan</h2>
						<figure class="flex gap-4 p-3">
							<figure class="relative">
								<img src={userProfile} class="h-12 w-12 rounded-full md:h-16 md:w-16" alt="" />
								{#if userRole === 'admin'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="absolute top-0 right-0 h-4 text-amber-400 md:h-5"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5Zm0 3.9a3 3 0 1 1-3 3a3 3 0 0 1 3-3m0 7.9c2 0 6 1.09 6 3.08a7.2 7.2 0 0 1-12 0c0-1.99 4-3.08 6-3.08"
										/></svg
									>
								{/if}
							</figure>
							<article>
								<h2
									class="text-sm font-semibold md:text-lg {userRole === 'admin'
										? 'text-amber-500'
										: ''}"
								>
									{userName}
								</h2>
								<p class="text-dark-700 text-xs md:text-sm">{userEmail}</p>
							</article>
						</figure>
						<div class="mt-4">
							<h2 class="text-dark-700 mb-2 px-2 text-xs md:text-sm">Options</h2>
							<Button
								onclick={() => goto('/report').then(() => (openProfile = false))}
								style="bg-trasparent  justify-between hover:bg-light-200 max-md:text-sm rounded-lg text-dark-500 w-full"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5.5" viewBox="0 0 24 24"
									><g
										fill="none"
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										><path d="M13 17a4 4 0 1 0 8 0a4 4 0 1 0-8 0" /><path
											d="M17 13v4h4M12 3v4a1 1 0 0 0 1 1h4"
										/><path d="M11.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v2m0 3v4" /></g
									></svg
								>
								Laporan Anda
							</Button>
							<AlertDialog.Root>
								<AlertDialog.Trigger
									class="flex w-full items-center justify-between rounded-lg px-4 py-2 text-red-400 hover:bg-red-100 max-md:text-sm"
									><Logout />Logout</AlertDialog.Trigger
								>
								<AlertDialog.Content>
									<AlertDialog.Header class="max-md:items-start">
										<AlertDialog.Title>Apakah anda yakin?</AlertDialog.Title>
										<AlertDialog.Description>
											Aksi ini akan mengeluarkan anda dari akun.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer class="max-md:ml-auto max-md:flex-row">
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action class="bg-red-600 hover:bg-red-600/80" onclick={logout}
											>Logout</AlertDialog.Action
										>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<Button
				onclick={() => goto('/login', { invalidateAll: true })}
				style="font-medium gap-4 max-md:text-sm">Login</Button
			>
		{/if}
	</div>
</nav>

<style lang="postcss">
	@reference "../../app.css";

	nav {
	}
	a.selected {
		@apply bg-white text-amber-500 hover:text-amber-500;
	}
</style>
