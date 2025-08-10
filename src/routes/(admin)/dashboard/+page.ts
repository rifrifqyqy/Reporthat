import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/reports');
		if (!response.ok) {
			throw new Error('Gagal mengambil data laporan.');
		}
		const { reports } = await response.json();
		return { reports };
	} catch (error) {
		console.error('Error in load function:', error);
		return { reports: [], error: (error as Error).message };
	}
};
