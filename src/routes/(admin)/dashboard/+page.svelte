<script lang="ts">
	import { getUserState } from '$lib/state/user-state.svelte';
	import { onMount } from 'svelte';

	let userContext = getUserState();
	let { user } = $derived(userContext);

	let loading = $state(true);
	let error = $state('');

	async function reportsData() {
		const response = await fetch('/api/reports');
		if (!response.ok) throw new Error('Gagal fetch data');
		const { reports } = await response.json();
		return reports;
	}

	onMount(() => {
		reportsData();
	});
</script>

<main class="space-y-8 px-8">
	<header>
		<h1 class="text-2xl font-bold">Dashboard Laporan</h1>
	</header>

	<section>
		<ul
			class="grid grid-cols-8 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold"
		>
			<li class="col-span-2">Judul Laporan</li>
			<li class="col-span-2">Maps</li>
			<li>Image</li>
			<li>Status</li>
			<li>Tanggal Laporan</li>
			<li>Aksi</li>
		</ul>
		<ul class="mt-4 space-y-4">
			{#await reportsData()}
				<p class="rounded-lg bg-gray-50 px-4 py-3 text-center text-sm font-semibold">Loading...</p>
			{:then _}
				{#each _ as report}
					<section
						class="grid grid-cols-8 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm"
					>
						<li class="col-span-2">{report.title}</li>
						<li class="col-span-2">
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={`https://maps.google.com/maps?q=${report.lat},${report.lng}&z=15&output=embed`}
								>Lihat di Peta</a
							>
						</li>
						<li>{report.images.length}</li>
						<li>{report.status}</li>
						<li>{new Date(report.created_at).toLocaleDateString()}</li>
						<li><button class="text-blue-600 underline">Detail</button></li>
					</section>
				{/each}
			{:catch error}
				<p class="text-red-500">Gagal memuat laporan: {error.message}</p>
				<p>Tidak ada laporan ditemukan.</p>
			{/await}
		</ul>
	</section>
</main>
