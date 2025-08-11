import { prisma } from '$lib/prismaClient';
import { json } from '@sveltejs/kit';

import { ReportStatus } from '@prisma/client';

export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const { status } = await request.json();

		if (!status || !Object.values(ReportStatus).includes(status)) {
			return json(
				{
					success: false,
					message: `Status tidak valid. Gunakan salah satu dari: ${Object.values(ReportStatus).join(', ')}`
				},
				{ status: 400 }
			);
		}

		const updatedReport = await prisma.reports.update({
			where: {
				id: id
			},
			data: {
				status: status
			}
		});

		return json({ success: true, report: updatedReport });
	} catch (error) {
		console.error('Gagal mengubah laporan:', error);
		return json(
			{ success: false, message: 'Laporan tidak ditemukan atau terjadi kesalahan server.' },
			{ status: 500 }
		);
	}
}

export async function DELETE({ params }) {
	try {
		const { id } = params;

		await prisma.reports.delete({
			where: {
				id: id
			}
		});

		return json({ success: true, message: 'Laporan berhasil dihapus.' }, { status: 200 });
	} catch (error) {
		console.error('Gagal menghapus laporan:', error);
		return json(
			{ success: false, message: 'Laporan tidak ditemukan atau terjadi kesalahan server.' },
			{ status: 500 }
		);
	}
}

