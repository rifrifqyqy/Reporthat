<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { fade } from 'svelte/transition';
	import { formatTanggal } from '$lib/utils/formatDatetime';
	const { data } = $props<{ data: PageData }>();

	let reports = $state(data.reports);

	const validStatuses = ['PENDING', 'REVIEWING', 'RESOLVED'];

	async function updateStatus(reportId: string, newStatus: string) {
		const originalStatus = reports.find((r: any) => r.id === reportId)?.status;
		const reportToUpdate = reports.find((r: any) => r.id === reportId);
		if (reportToUpdate) {
			reportToUpdate.status = newStatus;
		}

		try {
			const response = await fetch(`/api/reports/${reportId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			});

			const result = await response.json();

			if (!result.success) {
				if (reportToUpdate && originalStatus) {
					reportToUpdate.status = originalStatus;
				}
				alert(`Gagal mengubah status: ${result.message}`);
			} else {
				goto('/dashboard', { invalidateAll: true, replaceState: true });
			}
		} catch (error) {
			if (reportToUpdate && originalStatus) {
				reportToUpdate.status = originalStatus;
			}
			alert('Terjadi kesalahan koneksi saat mengubah status.');
			console.error('Fetch error:', error);
		}
	}
	async function reportsData() {
		const response = await fetch('/api/reports');
		if (!response.ok) throw new Error('Gagal fetch data');
		const { reports } = await response.json();
		return reports;
	}
	onMount(async () => {
		reports = await reportsData();
		// console.log(reports);
	});
	$effect(() => {
		reportsData();
	});
	type Status = 'PENDING' | 'RESOLVED' | 'REVIEWING';
	const statusClassMap = {
		PENDING: 'amber',
		RESOLVED: 'green',
		REVIEWING: 'pink',
		DEFAULT: 'violet'
	};
	function getStatusClass(status: Status) {
		return statusClassMap[status] ?? statusClassMap.DEFAULT;
	}

	let selectedReport: {
		id: string;
		description: string;
		images: string[];
		status: Status;
		title: string;
		created_at: string;
		lat: number;
		lng: number;
	} | null = $state(null);
	// $inspect(selectedReport);

	function openModal(report: any) {
		selectedReport = report;
	}

	function closeModal() {
		selectedReport = null;
	}
</script>

<main class="mt-4 space-y-8 px-4 md:px-8">
	<header>
		<h1 class="text-xl font-semibold md:text-2xl">Dashboard Laporan</h1>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/" class=" max-md:text-xs">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />

				<Breadcrumb.Item>
					<Breadcrumb.Page class="text-amber-600 max-md:text-xs">Dashboard</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</header>
	<div class="max-md:w-[calc(100%)] max-md:overflow-x-scroll">
		<section class="w-full space-y-4 max-md:w-max">
			<ul
				class="text-dark-500 grid grid-cols-9 gap-4 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-semibold"
			>
				<li class="col-span-2">Judul Laporan</li>
				<li class="col-span-2">Nama Pelapor</li>
				<li>Peta</li>
				<li>Gambar</li>
				<li>Status</li>
				<li>Tanggal</li>
				<li>Aksi</li>
			</ul>
			{#await reportsData()}
				<p
					class="grid animate-pulse items-center rounded-lg bg-gray-100 px-4 py-3 text-center text-sm"
				>
					Loading...
				</p>
			{:then _}
				{#each _ as report (report.id)}
					<ul
						class="grid grid-cols-9 items-center gap-4 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm md:py-3"
					>
						<li class="col-span-2">{report.title}</li>
						<li class="col-span-2">{report.users.raw_user_meta_data.full_name}</li>
						<li class="">
							<a
								href={`https://www.google.com/maps?q=${report.lat},${report.lng}`}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-600"
							>
								Lihat lokasi
							</a>
						</li>
						<li>{report.images.length}</li>
						<li>
							<div
								class="group text-{getStatusClass(
									report.status
								)}-600 flex w-fit items-center gap-2 rounded-full bg-gray-200 px-3 py-0.5 pr-2 md:py-1 focus-within:bg-{getStatusClass(
									report.status
								)}-100 focus-within:text-{getStatusClass(report.status)}-600"
							>
								<select
									bind:value={report.status}
									onchange={(e) => updateStatus(report.id, e.currentTarget.value)}
									class="mt-0.5 appearance-none text-[10px] outline-none md:text-xs"
								>
									{#each validStatuses as statusOption}
										<option value={statusOption}>{statusOption}</option>
									{/each}
								</select>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4.5" viewBox="0 0 16 16"
									><g fill="none" stroke="currentColor" stroke-width="1"
										><path
											d="m13.258 8.354l.904.805a.91.91 0 0 1 .196 1.169l-1.09 1.862a.94.94 0 0 1-.35.341a1 1 0 0 1-.478.125a1 1 0 0 1-.306-.046l-1.157-.382q-.304.195-.632.349l-.243 1.173a.93.93 0 0 1-.339.544a.97.97 0 0 1-.618.206H6.888a.97.97 0 0 1-.618-.206a.93.93 0 0 1-.338-.544l-.244-1.173a6 6 0 0 1-.627-.35L3.9 12.61a1 1 0 0 1-.306.046a1 1 0 0 1-.477-.125a.94.94 0 0 1-.35-.34l-1.129-1.863a.91.91 0 0 1 .196-1.187L2.737 8v-.354l-.904-.805a.91.91 0 0 1-.196-1.169L2.766 3.81a.94.94 0 0 1 .35-.341a1 1 0 0 1 .477-.125a1 1 0 0 1 .306.028l1.138.4q.305-.195.632-.349l.244-1.173a.93.93 0 0 1 .338-.544a.97.97 0 0 1 .618-.206h2.238a.97.97 0 0 1 .618.206c.175.137.295.33.338.544l.244 1.173q.325.155.627.35l1.162-.382a.98.98 0 0 1 .784.078c.145.082.265.2.35.34l1.128 1.863a.91.91 0 0 1-.182 1.187l-.918.782z"
										/><path d="M10.5 8a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" /></g
									></svg
								>
							</div>
						</li>
						<li>{new Date(report.created_at).toLocaleDateString()}</li>
						<li class="">
							<button class="text-blue-600 underline" onclick={() => openModal(report)}
								>Detail</button
							>
						</li>
					</ul>
				{/each}
			{:catch error}
				<p class="text-red-500">Gagal memuat laporan: {error.message}</p>
				<p>Tidak ada laporan ditemukan.</p>
			{/await}
			{#if selectedReport}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
					onclick={closeModal}
				>
					<div
						transition:fade={{ duration: 200 }}
						class="relative m-auto h-full max-h-[calc(100%-8rem)] w-full max-w-xs self-start overflow-y-scroll rounded-lg bg-white p-4 md:max-w-xl"
						onclick={(e) => e.stopPropagation()}
					>
						<button
							class="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
							onclick={closeModal}
						>
							✕
						</button>
						<h2 class=" border-b border-gray-200 pb-3 text-sm font-semibold md:text-lg">
							Detail Laporan
						</h2>
						<section class="text-dark-300 mt-4 space-y-4">
							<div class="flex items-start justify-between">
								<header class="space-y-1">
									<h1 class="text-base font-semibold md:text-xl">{selectedReport.title}</h1>
									<h2
										class="w-fit rounded-full bg-gradient-to-r px-3 py-0.5 text-[10px] font-semibold text-{getStatusClass(
											selectedReport.status
										)}-600 bg-gray-100"
									>
										{selectedReport.status}
									</h2>
								</header>
								<h2 class="text-xs text-gray-500 md:text-sm">
									{formatTanggal(selectedReport.created_at)}
								</h2>
							</div>
							<article class="space-y-2">
								<h2 class="text-sm text-gray-500">Deskripsi</h2>
								<p class="text-sm">{selectedReport.description}</p>
							</article>
						</section>
						<footer class="mt-4 space-y-2">
							<h2 class="text-sm text-gray-500">Rincian Foto</h2>
							<figure class="grid grid-cols-2 gap-4 md:grid-cols-4">
								{#each selectedReport.images as img}
									<img src={img} class="h-24 w-full rounded-sm object-cover" alt="" />
								{/each}
							</figure>
						</footer>
						<footer class="mt-4 space-y-2">
							<div class="flex items-center justify-between">
								<h2 class="text-sm text-gray-500">Lokasi</h2>
								<a
									href={`https://www.google.com/maps?q=${selectedReport.lat.toFixed(4)},${selectedReport.lng.toFixed(4)}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-blue-500">Lihat di Peta</a
								>
							</div>
							<iframe
								title="map"
								width="100%"
								height="220"
								frameborder="0"
								style="border:0"
								class="rounded-xl"
								src={`https://maps.google.com/maps?q=${selectedReport.lat},${selectedReport.lng}&z=15&output=embed`}
								allowfullscreen
							></iframe>
						</footer>
					</div>
				</div>
			{/if}
		</section>
	</div>
</main>

<style lang="postcss">
	@reference "../../../app.css";

	ul {
		li {
			@apply text-xs md:text-sm;
		}
	}
</style>
