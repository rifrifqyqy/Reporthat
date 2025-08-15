<script>
	import Divider from './../../components/elements/Divider.svelte';

	let name = $state('ini state');

	let data = [
		{
			id: 1,
			name: 'test'
		},
		{
			id: 2,
			name: 'test 2'
		}
	];
</script>

<svelte:head>
	<title>Reporthat - About</title>
	<meta
		name="description"
		content="Reporthat adalah platform digital yang memudahkan warga untuk melaporkan kerusakan fasilitas
				dan layanan publik di lingkungan sekitar mereka, demi mendorong perbaikan dan pembangunan
				komunitas yang lebih baik."
	/>
</svelte:head>

<section class="font-inter min-h-screen bg-white px-6 py-24 text-gray-900 md:px-16">
	<div class="mx-auto max-w-5xl space-y-16">
		<!-- Hero Section -->
		<div class="flex flex-col gap-4 text-center">
			<header class="mx-auto">
				<img src="/images/reporthat-logo.png" alt="" />
			</header>
			<h1 class="mt-8 text-4xl leading-tight font-bold tracking-tight md:text-6xl">
				Empowering Decisions with Clarity
			</h1>
			<p class="text-lg text-gray-600 md:text-xl">
				Reporthat adalah platform digital yang memudahkan warga untuk melaporkan kerusakan fasilitas
				dan layanan publik di lingkungan sekitar mereka, demi mendorong perbaikan dan pembangunan
				komunitas yang lebih baik.
			</p>
		</div>

		<!-- Vision & Mission -->
		<div class="grid gap-12 md:grid-cols-2">
			<div>
				<h2 class="mb-4 text-2xl font-semibold">Our Vision</h2>
				<p class="leading-relaxed text-gray-700">
					Menjadi platform terdepan yang memberdayakan setiap warga untuk aktif berpartisipasi dalam
					menciptakan lingkungan publik yang lebih baik, aman, dan tertata.
				</p>
			</div>
			<div>
				<h2 class="mb-4 text-2xl font-semibold">Our Mission</h2>
				<p class="leading-relaxed text-gray-700">
					Misi Reporthat adalah memfasilitasi partisipasi aktif warga dalam memelihara lingkungan
					publik dengan menyediakan platform pelaporan yang sangat mudah diakses dan efisien. Kami
					berkomitmen untuk menjadi jembatan efektif antara masyarakat pelapor dan pihak berwenang,
					memastikan setiap laporan ditindaklanjuti dengan cepat dan transparan. Melalui sistem ini,
					kami berharap dapat mendorong rasa kepemilikan komunitas terhadap infrastruktur sekitar
					dan menyediakan data akurat yang mendukung pengambilan keputusan pemerintah, demi
					terwujudnya lingkungan kota yang bersih, aman, dan berfungsi optimal bagi semua.
				</p>
			</div>
		</div>
		<Divider />
		<!-- Technologies -->
		<div class="space-y-6">
			<h2 class="text-2xl font-semibold">Built with Cutting-Edge Tools</h2>
			<ul class="grid grid-cols-1 gap-6 text-gray-700 md:grid-cols-3">
				<!-- SvelteKit -->
				<li class="bg-light-200 flex items-start gap-4 p-4">
					<img
						src="/images/svelte-logo.webp"
						alt="SvelteKit Logo"
						class="h-10 w-10 object-contain"
					/>
					<div>
						<strong>SvelteKit</strong><br />
						Lightning-fast frontend with modular architecture and reactive runes.
					</div>
				</li>

				<!-- GSAP -->
				<li class="bg-light-200 flex items-start gap-4 p-4">
					<img
						src="/images/gsap-logo.webp"
						alt="GSAP Logo"
						class="h-10 w-10 rounded-lg object-contain brightness-75"
					/>
					<div>
						<strong>GSAP</strong><br />
						Smooth, expressive animations that elevate user experience.
					</div>
				</li>

				<!-- Supabase -->
				<li class="bg-light-200 flex items-start gap-4 p-4">
					<img
						src="/images/supabase-logo.png"
						alt="Supabase Logo"
						class="h-10 w-10 rounded-lg object-contain"
					/>
					<div>
						<strong>Supabase</strong><br />
						Scalable backend with instant APIs, auth, and real-time data.
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>

<style>
</style>
