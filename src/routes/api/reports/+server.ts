import { prisma } from '$lib/prismaClient';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const data = await request.json();

		const report = await prisma.reports.create({
			data: {
				user_id: data.user_id,
				title: data.title,
				description: data.description,
				images: data.images,
				lat: data.lat,
				lng: data.lng,
				status: 'PENDING'
			}
		});

		return json({ success: true, report });
	} catch (error) {
		console.error('Gagal menyimpan laporan:', error);
		return json(
			{ success: false, message: 'Terjadi kesalahan saat menyimpan laporan.' },
			{ status: 500 }
		);
	}
}
