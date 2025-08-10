<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import { formatTanggal } from '$lib/utils/formatDatetime.js';
	import { slide, fade } from 'svelte/transition';
	import Button from '../../../components/elements/button/Button.svelte';

	let { data } = $props();
	$inspect(data);

	let modalState = $state(false);
	let selectedReport: {
		id: string;
		description: string;
		images: string[];
		status: string;
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
</script>

<main class="space-y-8">
	<header class="flex flex-col gap-2">
		<h1 class=" text-3xl font-semibold">Laporan Saya</h1>
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />

				<Breadcrumb.Item>
					<Breadcrumb.Page class="text-amber-600">Report</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</header>
	<section class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each data.reports as _}
			<div
				class="border-light-400 relative h-fit w-full space-y-8 overflow-clip rounded-xl border bg-gradient-to-r from-gray-50 from-30% to-amber-500 to-130% p-4"
			>
				<img src="/images/logohd.png" class="absolute -top-16 right-0 h-70 opacity-20" alt="" />
				<div class=" transition-shadow duration-300">
					<div class=" space-y-1">
						<h3 class="text-xl font-semibold text-gray-800">{_.title}</h3>
						<div class="flex items-center gap-2">
							<span
								class="w-fit rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-semibold text-white"
								>{_.status}
							</span>
							<span
								class="text-dark-600 flex w-fit items-center gap-3 rounded-full bg-gray-200 px-3 py-1 text-sm"
								>{_.images.length}

								<svg xmlns="http://www.w3.org/2000/svg" class="h-4" viewBox="0 0 512 512"
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
					<p class=" text-sm font-medium text-gray-500">{formatTanggal(_.created_at)}</p>
					<Button onclick={() => openModal(_)} style="rounded-full text-sm bg-dark-300"
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
						class="relative m-auto h-full max-h-[calc(100%-8rem)] w-full max-w-xl self-start overflow-y-scroll rounded-lg bg-white p-4"
					>
						<button
							class="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
							onclick={closeModal}
						>
							✕
						</button>
						<h2 class=" border-b border-gray-200 pb-3 text-lg font-semibold">Detail Laporan</h2>
						<section class="text-dark-300 mt-4 space-y-4">
							<header class="space-y-1">
								<h1 class="text-xl font-semibold">{selectedReport.title}</h1>
								<h2 class="w-fit rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-500">
									{selectedReport.status}
								</h2>
							</header>
							<article class="space-y-2">
								<h2 class="text-sm text-gray-500">Deskripsi</h2>
								<p class="text-sm">{selectedReport.description}</p>
							</article>
						</section>
						<footer class="mt-8 space-y-2">
							<h2 class="text-sm text-gray-500">Rincian Foto</h2>
							<figure class="grid grid-cols-4 gap-4">
								{#each selectedReport.images as img}
									<img src={img} class="h-24 w-full rounded-sm object-cover" alt="" />
								{/each}
							</figure>
						</footer>
						<footer class="mt-8 space-y-2">
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
