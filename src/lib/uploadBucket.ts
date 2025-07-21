import { supabase } from './supabaseClient';
import { compressImage } from './utils/compressImg';

export type UploadResult = {
	publicURL: string;
};

/**
 * Uploads a file to a specified bucket and returns its public URL.
 *
 * @param file - The file or blob to be uploaded.
 * @param bucket - The name of the storage bucket where the file will be uploaded.
 * @param filename - The name to be used for the uploaded file.
 * @returns A promise that resolves to an UploadResult containing the public URL of the uploaded file.
 * @throws Will throw an error if the upload fails or if the public URL cannot be retrieved.
 */

export async function uploadFile(
	file: File | Blob, // tipe file: File atau Blob
	bucket: string, // nama bucket
	filename: string // nama file yang akan disimpan
): Promise<UploadResult> {
	// Upload file ke bucket
	const normalizedFilename = filename.startsWith('/') ? filename.slice(1) : filename;
	const compressed = await compressImage(file, 100);
	const { error } = await supabase.storage.from(bucket).upload(normalizedFilename, compressed, {
		upsert: true
	});

	if (error) {
		throw new Error(`Upload gagal: ${error.message}`);
	}

	// Dapatkan public URL dari file yang baru saja diupload;
	// getPublicUrl bersifat sinkron dan mengembalikan objek dengan properti `publicUrl`
	const {
		data: { publicUrl }
	} = supabase.storage.from(bucket).getPublicUrl(normalizedFilename);

	// Jika publicUrl kosong, lempar error (atau kamu bisa memilih untuk mengembalikan null sesuai kebutuhan)
	if (!publicUrl) {
		throw new Error(`Gagal mendapatkan URL publik untuk file: ${normalizedFilename}`);
	}

	return { publicURL: publicUrl };
}
