<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { formatTanggal } from '$lib/utils/formatDatetime.js';

	let { data } = $props();
	$inspect(data);
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
	<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.reports as _}
			<div class=" w-full gap-4 p-4">
				<div
					class="border-light-400 mb-4 rounded-xl border bg-white p-3 transition-shadow duration-300"
				>
					<div class="bg-light-200 space-y-1 rounded-lg p-2">
						<h3 class="text-xl font-semibold text-gray-800">{_.title}</h3>
						<p class="bg-dark-400 w-fit rounded-full px-3 py-1 text-xs">
							<span
								class="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-xs font-semibold text-transparent"
								>{_.status}</span
							>
						</p>
					</div>
					<p class=" text-xs text-gray-500">Tanggal: {formatTanggal(_.created_at)}</p>
					<a
						href={`https://www.google.com/maps?q=${_.lat.toFixed(4)},${_.lng.toFixed(4)}`}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-3 inline-block text-sm text-blue-600 underline hover:text-blue-800"
					>
						Lihat di Google Maps
					</a>
				</div>

				<!-- Repeat this block for each report item -->
			</div>
		{/each}
	</section>
</main>
