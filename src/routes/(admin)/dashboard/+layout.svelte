<script>
	let { children } = $props();
</script>

<main>
	<nav></nav>
	{@render children()}
	<footer></footer>
</main>
