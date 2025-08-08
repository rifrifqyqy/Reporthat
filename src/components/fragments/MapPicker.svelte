<script lang="ts">
	import '../../../node_modules/leaflet/dist/leaflet.css';
	import { onMount } from 'svelte';

	interface LocationProps {
		location?: { lat: number; lng: number };
		onchange?: (location: { lat: number; lng: number }) => void;
	}

	let { location = $bindable({ lat: -6.2, lng: 106.8 }), onchange }: LocationProps = $props();

	let mapDiv: HTMLDivElement;
	let map: any;
	let marker: any;

	async function locateUser(event: Event) {
		// Prevent form submission
		event.preventDefault();
		event.stopPropagation();

		if (!navigator.geolocation) {
			alert('Geolocation tidak didukung browser ini.');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				location = { lat: latitude, lng: longitude };
				map.setView([latitude, longitude], 15);
				marker.setLatLng([latitude, longitude]);
				onchange?.(location);
			},
			(err) => {
				alert('Gagal mendapatkan lokasi: ' + err.message);
			}
		);
	}

	onMount(async () => {
		if (typeof window === 'undefined') return;
		const L = await import('leaflet');

		map = L.map(mapDiv).setView([location.lat, location.lng], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		marker = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);

		marker.on('dragend', () => {
			const pos = marker.getLatLng();
			location = { lat: pos.lat, lng: pos.lng };
			onchange?.(location);
		});

		map.on('click', (e: any) => {
			const { lat, lng } = e.latlng;
			location = { lat, lng };
			marker.setLatLng([lat, lng]);
			onchange?.(location);
		});
	});
</script>

<div class="relative">
	<div bind:this={mapDiv} class="map-container rounded border"></div>
	<button
		type="button"
		onclick={locateUser}
		class="absolute top-2 right-2 rounded bg-white px-3 py-1 text-sm text-black shadow-md transition hover:bg-gray-100"
	>
		Lokasi Saya
	</button>
</div>

<style>
	.map-container {
		width: 100%;
		height: 400px;
	}
	:global(.leaflet-container) {
		width: 100%;
		height: 100%;
		z-index: 0;
	}
</style>
