<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { getUserState } from '$lib/state/user-state.svelte';
	import { uploadFile } from '$lib/uploadBucket';
	import { z } from 'zod';
	import MapPicker from '../../../../components/fragments/MapPicker.svelte';

	let userContext = getUserState();
	let { user } = $derived(userContext);

	// $inspect(user);
	let userId = $derived(user?.id);

	// Form state
	let title = $state('');
	let description = $state('');
	let files: File[] = $state([]);
	let previewUrls: string[] = $state([]);
	let location = $state({ lat: -6.2, lng: 106.8 }); // Default Jakarta

	// Validation schema
	const reportSchema = z.object({
		title: z
			.string()
			.min(1, 'Judul wajib diisi')
			.min(5, 'Judul minimal 5 karakter')
			.max(100, 'Judul maksimal 100 karakter'),
		description: z
			.string()
			.min(1, 'Deskripsi wajib diisi')
			.min(10, 'Deskripsi minimal 10 karakter')
			.max(1000, 'Deskripsi maksimal 1000 karakter'),
		images: z
			.array(z.instanceof(File))
			.min(1, 'Minimal satu gambar harus diupload')
			.max(5, 'Maksimal 5 gambar')
			.refine(
				(files) => files.every((file) => file.size <= 5 * 1024 * 1024),
				'Ukuran file maksimal 5MB'
			)
			.refine(
				(files) => files.every((file) => file.type.startsWith('image/')),
				'File harus berupa gambar'
			),
		location: z.object({
			lat: z.number().min(-90).max(90),
			lng: z.number().min(-180).max(180)
		})
	});

	// Validation state
	let errors = $state<{
		title?: string[];
		description?: string[];
		images?: string[];
		location?: string[];
	}>({});

	let isSubmitting = $state(false);
	let hasValidated = $state(false);

	// Reactive validation
	$effect(() => {
		if (!hasValidated) return;

		const formData = {
			title,
			description,
			images: files,
			location
		};

		const result = reportSchema.safeParse(formData);

		if (result.success) {
			errors = {};
		} else {
			const newErrors: typeof errors = {};
			result.error.issues.forEach((issue) => {
				const path = issue.path.join('.') as keyof typeof errors;
				if (!newErrors[path]) {
					newErrors[path] = [];
				}
				newErrors[path]!.push(issue.message);
			});
			errors = newErrors;
		}
	});

	// Computed properties for individual field validation
	let titleErrors = $derived(errors.title || []);
	let descriptionErrors = $derived(errors.description || []);
	let imageErrors = $derived(errors.images || []);
	let locationErrors = $derived(errors.location || []);

	// Check if form is valid
	let isFormValid = $derived(
		Object.keys(errors).length === 0 &&
			title.length > 0 &&
			description.length > 0 &&
			files.length > 0
	);

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files) return;

		const newFiles = Array.from(input.files);

		// Validate file count
		if (files.length + newFiles.length > 5) {
			alert('Maksimal 5 gambar yang dapat diupload');
			return;
		}

		// Validate file size and type
		for (const file of newFiles) {
			if (file.size > 5 * 1024 * 1024) {
				alert(`File ${file.name} terlalu besar. Maksimal 5MB`);
				return;
			}
			if (!file.type.startsWith('image/')) {
				alert(`File ${file.name} bukan gambar yang valid`);
				return;
			}
		}

		files = [...files, ...newFiles];

		// Generate preview URLs
		for (const file of newFiles) {
			const reader = new FileReader();
			reader.onload = () => {
				previewUrls = [...previewUrls, reader.result as string];
			};
			reader.readAsDataURL(file);
		}

		// Trigger validation
		hasValidated = true;
	}

	function removeImage(index: number) {
		files = files.filter((_, i) => i !== index);
		previewUrls = previewUrls.filter((_, i) => i !== index);
		hasValidated = true;
	}

	// Trigger validation on field blur
	function handleTitleBlur() {
		hasValidated = true;
	}

	function handleDescriptionBlur() {
		hasValidated = true;
	}

	const uploadImages = async (files: File[], bucket: string = 'report-file') => {
		const uploadPromises = files.map((file) => {
			const filename = `reports/${Date.now()}-${file.name}`;
			return uploadFile(file, bucket, filename);
		});

		try {
			const results = await Promise.all(uploadPromises);
			return results.map((r) => r.publicURL);
		} catch (err) {
			console.error('Upload error:', err);
			return [];
		}
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		hasValidated = true;

		const formData = {
			title,
			description,
			images: files,
			location
		};

		// Final validation
		const result = reportSchema.safeParse(formData);

		if (!result.success) {
			console.error('Validation errors:', result.error.issues);
			alert('Mohon perbaiki kesalahan pada form');
			return;
		}

		if (!userId) {
			alert('User tidak ditemukan. Mohon login kembali.');
			return;
		}

		isSubmitting = true;

		try {
			const imageUrls = await uploadImages(files, 'report-file');

			if (imageUrls.length === 0) {
				throw new Error('Gagal upload gambar');
			}

			const bodyData = {
				user_id: userId,
				title,
				description,
				images: imageUrls,
				lat: location.lat,
				lng: location.lng
			};

			const res = await fetch('/api/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bodyData)
			});

			const data = await res.json();

			if (!res.ok || !data.success) {
				throw new Error(data.message || 'Gagal kirim laporan');
			}

			alert('Laporan berhasil dikirim!');
			goto('/report', { invalidateAll: true });
		} catch (err) {
			console.error('[X] Error caught:', err);
			const errorMessage =
				err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim laporan.';
			alert(errorMessage);
		} finally {
			isSubmitting = false;
		}
	};
</script>

<main class="space-y-8">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/report">Laporan Saya</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				<Breadcrumb.Page>Report</Breadcrumb.Page>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>

	<form
		onsubmit={handleSubmit}
		class="mx-auto my-8 max-w-5xl space-y-6 rounded-lg bg-white p-6 shadow-xl"
	>
		<h2 class="mb-6 text-center text-3xl font-bold text-gray-800">Form Laporan Baru</h2>

		<!-- Title Field -->
		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700">
				Judul <span class="text-red-500">*</span>
			</label>
			<input
				bind:value={title}
				type="text"
				id="title"
				onblur={handleTitleBlur}
				class="w-full rounded-md border px-4 py-2 transition duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none {titleErrors.length >
				0
					? 'border-red-300 bg-red-50'
					: 'border-gray-300'}"
				placeholder="Masukkan judul laporan"
				required
			/>
			{#if titleErrors.length > 0}
				<div class="mt-1 space-y-1">
					{#each titleErrors as error}
						<p class="text-sm text-red-600">{error}</p>
					{/each}
				</div>
			{/if}
			<p class="mt-1 text-xs text-gray-500">
				{title.length}/100 karakter
			</p>
		</div>

		<!-- Description Field -->
		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700">
				Deskripsi <span class="text-red-500">*</span>
			</label>
			<textarea
				bind:value={description}
				id="description"
				rows="4"
				onblur={handleDescriptionBlur}
				class="w-full resize-y rounded-md border px-4 py-2 transition duration-200 ease-in-out focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none {descriptionErrors.length >
				0
					? 'border-red-300 bg-red-50'
					: 'border-gray-300'}"
				placeholder="Jelaskan detail laporan Anda"
				required
			></textarea>
			{#if descriptionErrors.length > 0}
				<div class="mt-1 space-y-1">
					{#each descriptionErrors as error}
						<p class="text-sm text-red-600">{error}</p>
					{/each}
				</div>
			{/if}
			<p class="mt-1 text-xs text-gray-500">
				{description.length}/1000 karakter
			</p>
		</div>

		<!-- Image Upload Field -->
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-700">
				Upload Gambar <span class="text-red-500">*</span>
			</label>

			<div class="flex items-center space-x-4">
				<label
					class="cursor-pointer rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition duration-200 ease-in-out hover:bg-blue-100 {files.length >=
					5
						? 'cursor-not-allowed opacity-50'
						: ''}"
				>
					Pilih File
					<input
						type="file"
						multiple
						accept="image/*"
						onchange={handleFileChange}
						class="hidden"
						disabled={files.length >= 5}
					/>
				</label>

				{#if previewUrls.length === 0}
					<span class="text-sm text-gray-500">Belum ada gambar yang dipilih.</span>
				{:else}
					<span class="text-sm text-gray-700">{previewUrls.length}/5 gambar dipilih</span>
				{/if}
			</div>

			{#if imageErrors.length > 0}
				<div class="mt-2 space-y-1">
					{#each imageErrors as error}
						<p class="text-sm text-red-600">{error}</p>
					{/each}
				</div>
			{/if}

			<p class="mt-1 text-xs text-gray-500">
				Format: JPG, PNG, WebP. Maksimal 5MB per file, 5 file total.
			</p>

			<div class="mt-4 flex flex-wrap gap-3">
				{#each previewUrls as url, i}
					<div class="group relative h-24 w-24">
						<img
							src={url}
							alt="preview"
							class="h-full w-full rounded-lg border border-gray-200 object-cover shadow-sm"
						/>
						<!-- Tombol X untuk hapus -->
						<button
							type="button"
							class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md transition hover:bg-red-700"
							onclick={() => removeImage(i)}
							aria-label="Hapus gambar"
						>
							✕
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Location Field -->
		<div>
			<label class="mb-1 block text-sm font-medium text-gray-700">
				Lokasi <span class="text-red-500">*</span>
			</label>
			<MapPicker bind:location />
			<div class="overflow-hidden rounded-md border border-gray-300 shadow-sm"></div>
			{#if locationErrors.length > 0}
				<div class="mt-2 space-y-1">
					{#each locationErrors as error}
						<p class="text-sm text-red-600">{error}</p>
					{/each}
				</div>
			{/if}
			<p class="mt-2 text-sm text-gray-600">
				Koordinat: <span class="font-semibold text-blue-600"
					>Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</span
				>
			</p>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			disabled={!isFormValid || isSubmitting}
			class="w-full transform rounded-md px-6 py-3 text-lg font-semibold text-white transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none {isFormValid &&
			!isSubmitting
				? 'bg-blue-600 hover:scale-105 hover:bg-blue-700'
				: 'cursor-not-allowed bg-gray-400'}"
		>
			{#if isSubmitting}
				<span class="flex items-center justify-center space-x-2">
					<svg
						class="h-5 w-5 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4z"></path>
					</svg>
					<span>Mengirim Laporan...</span>
				</span>
			{:else}
				Kirim Laporan
			{/if}
		</button>

		<!-- Form Status -->
		{#if hasValidated}
			<div class="text-center">
				{#if isFormValid}
					<p class="text-sm text-green-600">✓ Form siap untuk dikirim</p>
				{:else}
					<p class="text-sm text-red-600">⚠ Mohon perbaiki kesalahan di atas</p>
				{/if}
			</div>
		{/if}
	</form>
</main>
