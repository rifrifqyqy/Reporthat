<script>
	let { children } = $props();
</script>

<main class="grid h-screen max-h-screen grid-cols-1 p-4 md:grid-cols-3 md:gap-16">
	{@render children()}
	<!-- Right: Image -->
	<div class="relative col-span-2 hidden overflow-hidden rounded-tl-3xl rounded-br-3xl md:block">
		<img
			src="/images/login-banner.jpg"
			alt="Login Illustration"
			class="absolute inset-0 h-full w-full object-cover brightness-75"
		/>

		<img
			src="/images/logo.png"
			class="absolute top-4 left-4 h-16 rounded-full bg-white/30 px-4 py-2 backdrop-blur-sm"
			alt=""
		/>
	</div>
</main>
