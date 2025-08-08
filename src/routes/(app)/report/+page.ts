import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/user-reports');
	const data = await res.json();

	if (!res.ok || !data.success) {
		console.error('Gagal mengambil laporan:', data.message);
		return { reports: [] };
	}

	return { reports: data.reports };
};
