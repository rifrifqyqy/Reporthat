<script lang="ts">
	import type { PageData } from './$types';

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
				console.log('Status berhasil diubah:', result.report);
			}
		} catch (error) {
			if (reportToUpdate && originalStatus) {
				reportToUpdate.status = originalStatus;
			}
			alert('Terjadi kesalahan koneksi saat mengubah status.');
			console.error('Fetch error:', error);
		}
	}
</script>

<main class="space-y-8 px-8">
	<header>
		<h1 class="text-2xl font-bold">Dashboard Laporan</h1>
	</header>

	{#if data.error}
		<p class="rounded-lg border border-red-300 bg-red-100 p-4 text-center text-red-700">
			{data.error}
		</p>
	{/if}

	<div class="overflow-x-auto rounded-lg border border-gray-300">
		<table class="min-w-full divide-y divide-gray-200 bg-white text-sm">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-3 text-left font-semibold text-gray-700">Judul Laporan</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700">Peta</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700">Gambar</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700">Tanggal</th>
					<th class="px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each reports as report (report.id)}
					<tr>
						<td class="px-4 py-3">{report.title}</td>
						<td class="px-4 py-3">
							<a
								href={`https://www.google.com/maps?q=${report.lat},${report.lng}`}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-600 hover:underline">Lihat Peta</a
							>
						</td>
						<td class="px-4 py-3">{report.images.length}</td>
						<td class="px-4 py-3">
							<select
								bind:value={report.status}
								onchange={(e) => updateStatus(report.id, e.currentTarget.value)}
								class="focus:ring-opacity-50 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
							>
								{#each validStatuses as statusOption}
									<option value={statusOption}>{statusOption}</option>
								{/each}
							</select>
						</td>
						<td class="px-4 py-3">{new Date(report.created_at).toLocaleDateString('id-ID')}</td>
						<td class="px-4 py-3">
							<button class="text-blue-600 hover:underline">Detail</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="py-4 text-center text-gray-500">Tidak ada laporan ditemukan.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
