export async function compressImage(file: File | Blob, maxSizeKB: number = 100): Promise<Blob> {
	const imageBitmap = await createImageBitmap(file);
	const canvas = document.createElement('canvas');
	canvas.width = imageBitmap.width;
	canvas.height = imageBitmap.height;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas context not available');

	ctx.drawImage(imageBitmap, 0, 0);

	let quality = 0.8;
	let blob: Blob;

	do {
		blob = await new Promise<Blob>((resolve) =>
			canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality)
		);
		quality -= 0.1;
	} while (blob.size > maxSizeKB * 1024 && quality > 0.1);

	return blob;
}
