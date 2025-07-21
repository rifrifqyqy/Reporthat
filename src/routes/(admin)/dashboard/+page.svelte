<script>
	import { getUserState } from '$lib/state/user-state.svelte';

	let userContext = getUserState();
	let { user } = $derived(userContext);
	$inspect(user);

	function logout() {
		userContext.logout();
		window.location.href = '/login';
	}
</script>

<button onclick={logout} class="bg-red-500">Logout</button>
<main>
	dashboard

	<p>welcome {user?.email}</p>
</main>
