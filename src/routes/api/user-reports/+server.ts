import { prisma } from '$lib/prismaClient';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	const session = await locals.supabase.auth.getSession();
	const userId = session?.data.session?.user.id;

	if (!userId) {
		return json({ success: false, message: 'Anda belum login' }, { status: 401 });
	}

	try {
		const userReports = await prisma.reports.findMany({
			where: { user_id: userId },
			orderBy: { created_at: 'desc' },
			select: {
				id: true,
				title: true,
				description: true,
				images: true,
				lat: true,
				lng: true,
				status: true,
				created_at: true
			}
		});

		return json({ success: true, reports: userReports }, { status: 200 });
	} catch (err) {
		console.error('[X] Get user reports failed:', err);
		return json({ success: false, message: 'Gagal mengambil laporan' }, { status: 500 });
	}
}
