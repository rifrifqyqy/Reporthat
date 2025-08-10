<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import { formatTanggal } from '$lib/utils/formatDatetime.js';
	import { slide, fade } from 'svelte/transition';
	import Button from '../../../components/elements/button/Button.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	// $inspect(data);

	type Status = 'PENDING' | 'RESOLVED' | 'REVIEWING';
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

	function openModal(report: any) {
		selectedReport = report;
	}

	function closeModal() {
		selectedReport = null;
	}
	const statusClassMap = {
		PENDING: 'from-amber-400 to-amber-500',
		RESOLVED: 'from-emerald-400 to-emerald-500',
		REVIEWING: 'from-violet-400 to-violet-500',
		DEFAULT: 'from-gray-400 to-gray-500'
	};
	const statusBgMap = {
		PENDING: 'to-amber-500',
		RESOLVED: 'to-emerald-500',
		REVIEWING: 'to-violet-500',
		DEFAULT: 'to-gray-500'
	};

	function getStatusClass(status: Status) {
		return statusClassMap[status] ?? statusClassMap.DEFAULT;
	}
	function getStatusBg(status: Status) {
		return statusBgMap[status] ?? statusBgMap.DEFAULT;
	}
</script>

<main class="relative space-y-4 md:space-y-8">
	<Button onclick={() => goto('/report/add')} style="fixed right-4 bottom-12 md:hidden px-3 py-3"
		><svg xmlns="http://www.w3.org/2000/svg" class="h-7" viewBox="0 0 24 24"
			><path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"
			/></svg
		></Button
	>
	<div class="flex items-center justify-between">
		<header class="flex flex-col gap-2">
			<h1 class="text-xl font-semibold md:text-3xl">Laporan Saya</h1>
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="/" class=" max-md:text-xs">Home</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />

					<Breadcrumb.Item>
						<Breadcrumb.Page class="text-amber-600 max-md:text-xs">Report</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<Button
			style="font-medium gap-3 max-md:text-sm items-center max-md:hidden"
			onclick={() => goto('/report/add')}
			><svg xmlns="http://www.w3.org/2000/svg" class="h-6" viewBox="0 0 24 24"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"
				/></svg
			> Buat Laporan</Button
		>
	</div>
	<section class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
		{#each data.reports as _}
			<div
				class="border-light-400 relative h-fit w-full space-y-8 overflow-clip rounded-xl border bg-gradient-to-r from-gray-50 from-30% {getStatusBg(
					_.status
				)} to-130% p-3 md:p-4"
			>
				<img
					src="/images/logohd.png"
					class="absolute -top-16 right-0 h-70 opacity-20 grayscale"
					alt=""
				/>
				<div class=" transition-shadow duration-300">
					<div class=" space-y-1">
						<h3 class="text-base font-semibold text-gray-800 md:text-xl">{_.title}</h3>
						<div class="flex items-center gap-2">
							<span
								class="w-fit rounded-full bg-gradient-to-r {getStatusClass(
									_.status
								)} px-3 py-0.5 text-[10px] font-semibold text-white md:py-1 md:text-xs"
								>{_.status}
							</span>
							<span
								class="text-dark-600 flex w-fit items-center gap-3 rounded-full bg-gray-200 px-3 py-0.5 text-xs md:py-1 md:text-sm"
								>{_.images.length}

								<svg xmlns="http://www.w3.org/2000/svg" class="h-3 md:h-4" viewBox="0 0 512 512"
									><path
										fill="currentColor"
										d="M450.29 112H142c-34 0-62 27.51-62 61.33v245.34c0 33.82 28 61.33 62 61.33h308c34 0 62-26.18 62-60V173.33c0-33.82-27.68-61.33-61.71-61.33m-77.15 61.34a46 46 0 1 1-46.28 46a46.19 46.19 0 0 1 46.28-46.01Zm-231.55 276c-17 0-29.86-13.75-29.86-30.66v-64.83l90.46-80.79a46.54 46.54 0 0 1 63.44 1.83L328.27 337l-113 112.33ZM480 418.67a30.67 30.67 0 0 1-30.71 30.66H259L376.08 333a46.24 46.24 0 0 1 59.44-.16L480 370.59Z"
									/><path
										fill="currentColor"
										d="M384 32H64A64 64 0 0 0 0 96v256a64.11 64.11 0 0 0 48 62V152a72 72 0 0 1 72-72h326a64.11 64.11 0 0 0-62-48"
									/></svg
								>
							</span>
						</div>
					</div>
				</div>
				<footer class="relative flex items-center justify-between">
					<p class=" text-xs font-medium text-gray-500 md:text-sm">{formatTanggal(_.created_at)}</p>
					<Button onclick={() => openModal(_)} style="rounded-full text-xs md:text-sm bg-dark-300"
						>Lihat Detail</Button
					>
				</footer>
				<!-- Repeat this block for each report item -->
			</div>
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
										class="w-fit rounded-full bg-gradient-to-r {getStatusClass(
											selectedReport.status
										)} px-3 py-0.5 text-[10px] font-semibold text-white"
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
									href={`https://www.google.com/maps?q=${_.lat.toFixed(4)},${_.lng.toFixed(4)}`}
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
		{/each}
	</section>
</main>
