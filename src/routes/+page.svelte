<script lang="ts">
	import { goto } from '$app/navigation';
	import Camera from '../components/elements/icons/Camera.svelte';
	import Fix from '../components/elements/icons/Fix.svelte';
	import Upload from '../components/elements/icons/Upload.svelte';
	import LabelHero from '../components/elements/label/LabelHero.svelte';
	import { gsap } from 'gsap';

	import { animateIn } from '$lib/animations/animate-in';
	import { onMount, tick } from 'svelte';
	import { revealSplitText } from '$lib/animations/split-text';
	import hero_images from '$lib/constants/carousel-hero.json';
	import { fade, slide } from 'svelte/transition';
	import Divider from '../components/elements/Divider.svelte';
	import Button from '../components/elements/button/Button.svelte';

	// gsap state
	let title_hero: any;
	let label_gsap: any;
	let label_gsap2: any;
	let label_gsap3: any;
	$effect(() => {
		let split = new SplitText(title_hero, {
			type: 'chars, words, lines',
			mask: 'lines'
		});
		let chars = split.words;

		gsap.from(chars, {
			yPercent: 130,
			autoAlpha: 0,
			stagger: 0.02,
			ease: 'back.out',
			duration: 1
		});
	});
	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		const { SplitText } = await import('gsap/SplitText');
		gsap.registerPlugin(ScrollTrigger, SplitText);
		await tick();

		const elements = [label_gsap, label_gsap2, label_gsap3].filter(Boolean);
		animateIn(elements);
	});
	let left_container: any;
	let title_animation: any;
	let text_animation: any;
	let buttonEls: HTMLElement[] = [];
	let buttonCTA: HTMLDivElement;
	onMount(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '.hero-container',
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});

		tl.from(left_container, {
			x: -200,
			opacity: 0,
			duration: 1,
			ease: 'power2.out'
		});
		tl.from(buttonEls, {
			opacity: 0,
			y: -30,
			duration: 0.6,
			stagger: 0.1,
			ease: 'power2.out'
		});
		('<');
		revealSplitText(title_animation, {}, tl, '<+0.5');
		revealSplitText(text_animation, {}, tl, '<');
		tl.from(
			buttonCTA,
			{
				opacity: 0,
				x: 60,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power2.out'
			},
			'<'
		);
	});

	let steps_title: any;
	onMount(() => {
		const split = new SplitText(steps_title, {
			type: 'chars, words, lines',
			mask: 'lines'
		});

		const chars = split.words;

		gsap.from(chars, {
			yPercent: 130,
			autoAlpha: 0,
			stagger: { amount: 0.2, from: 'start' },
			ease: 'back.out',
			duration: 1,
			scrollTrigger: {
				trigger: steps_title,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});
	});

	let cards: HTMLElement[] = [];
	onMount(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: cards[0].parentElement,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});

		cards.forEach((card: any, i: any) => {
			tl.from(
				card,
				{
					y: i % 2 === 0 ? 100 : -100,
					opacity: 0,
					duration: 0.8,
					ease: 'power2.out'
				},
				i * 0.2
			);
		});
	});

	let quotes: any;
	onMount(() => {
		const split = new SplitText(quotes, {
			type: 'chars, words'
		});

		gsap.from(split.chars, {
			scrollTrigger: {
				trigger: quotes,
				start: 'top 70%',
				end: 'top 20%',
				scrub: true
			},
			opacity: 0.1,
			stagger: 5,
			duration: 1
		});
	});

	// cta
	let container_cta: any;
	let cta_title: any;
	let cta_button: any;
	onMount(() => {
		const split = new SplitText(cta_title, { type: 'words', mask: 'words' });

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: container_cta,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});

		// 1. Reveal container from bawah ke atas
		tl.from(container_cta, {
			y: 100,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		});

		// 2. Reveal text setelah container muncul
		tl.from(
			split.words,
			{
				yPercent: 120,
				opacity: 0,
				stagger: 0.05,
				duration: 0.6,
				ease: 'back.out'
			},
			'-=0.4'
		);
		tl.from(
			cta_button,
			{
				scale: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: 'back.out'
			},
			'-=0.3'
		);
	});

	// state
	let currentIndex = $state(0);
	let heroActive = $derived(hero_images[currentIndex]);
	$effect(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % hero_images.length;
			heroActive = hero_images[currentIndex];
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

<main class="space-y-16 overflow-hidden px-4 md:space-y-24 md:px-8 md:pb-16">
	<!-- Hero Section -->
	<div class="hero-container grid gap-8 overflow-hidden md:grid-cols-2">
		<section
			bind:this={left_container}
			class="relative flex h-90 w-full flex-col justify-between overflow-hidden rounded-2xl md:h-150"
		>
			<!-- Gambar di belakang -->
			{#key heroActive.img}
				<img
					transition:fade
					src={heroActive.img}
					class="absolute inset-0 z-0 h-full w-full object-cover object-top"
					alt=""
				/>
			{/key}

			<!-- Overlay opsional biar teks lebih jelas -->
			<div class="absolute inset-0 z-5 bg-black/50"></div>
			<ul
				class="relative z-10 m-4 ml-auto flex flex-wrap items-center gap-2 max-md:justify-end md:gap-4"
			>
				{#each hero_images as _, index}
					<button
						bind:this={buttonEls[index]}
						data-sveltekit-preload-code="hover"
						data-sveltekit-preload-data="hover"
						onclick={() => (currentIndex = index)}
						class="flex items-center gap-2 rounded-full
						 border border-white px-2 py-1 text-sm text-white backdrop-blur-xs transition-normal active:bg-white/50 md:gap-4 md:px-4 md:py-2 {currentIndex ===
						index
							? 'bg-white/40'
							: 'bg-white/20'}"
						>{_.category}
					</button>
				{/each}
			</ul>
			<!-- Teks di depan -->
			<article class="relative z-10 mt-auto p-4 text-white md:p-8">
				{#key heroActive.category}
					<h1
						transition:slide
						bind:this={title_animation}
						class="mb-2 text-3xl font-medium md:mb-4 md:text-5xl"
					>
						{heroActive.category}
					</h1>
				{/key}
				{#key heroActive.description}
					<p class="text-light-600 max-md:text-sm" transition:slide bind:this={text_animation}>
						{heroActive.description}
					</p>
				{/key}
				<div bind:this={buttonCTA}>
					<Button
						onclick={() => goto('/report', { invalidateAll: true })}
						style="font-medium gap-4 mt-4 ml-auto bg-gradient-to-r from-amber-500 to-60% to-amber-600 max-md:text-sm "
						>Let's Report</Button
					>
				</div>
			</article>
		</section>

		<section
			class="bg-light-200 flex h-full flex-col justify-between rounded-2xl p-3 max-md:gap-8 md:p-6"
		>
			<div>
				<h2
					class="max-w-lg overflow-hidden text-3xl leading-[120%] font-medium md:text-5xl"
					bind:this={title_hero}
				>
					Laporkan <span class="text-amber-500">kerusakan</span> lingkungan, semudah
					<span class="text-amber-500">jepretan</span> kamera
				</h2>
			</div>

			<ul class="flex flex-col gap-4">
				<div bind:this={label_gsap}>
					<LabelHero>
						{#snippet icon()}
							<Camera />
						{/snippet}
						{#snippet text()}
							Capture
						{/snippet}
					</LabelHero>
				</div>
				<div bind:this={label_gsap2}>
					<LabelHero>
						{#snippet icon()}
							<Upload />
						{/snippet}
						{#snippet text()}
							Report
						{/snippet}
					</LabelHero>
				</div>
				<div bind:this={label_gsap3}>
					<LabelHero>
						{#snippet icon()}
							<Fix />
						{/snippet}
						{#snippet text()}
							We Handle It
						{/snippet}
					</LabelHero>
				</div>
			</ul>
		</section>
	</div>
	<Divider />

	<!-- section cara laporkan -->
	<section class="space-y-16">
		<header class="flex"></header>
		{#snippet steps()}
			{@const steps = [
				{
					step: 'First Step',
					title: 'Take a Snapshot',
					img: '/images/capture.jpg',
					description:
						'Cukup foto atau rekam video kerusakan yang Anda temukan. Pastikan gambarnya jelas dan detail agar lokasi serta jenis kerusakannya mudah dikenali.'
				},
				{
					step: 'Second Step',
					title: 'Report THAT!',
					img: '/images/reporting.jpg',
					description:
						'Isi formulir laporan kerusakan dengan detail informasi tentang lokasi, jenis kerusakan, dan deskripsi kerusakan.'
				},
				{
					step: 'You Got it!',
					title: 'Resolved!',
					img: '/images/fixed.jpg',
					description:
						'Tim kami akan segera meninjau dan menindaklanjuti informasi yang Anda berikan untuk memastikan penanganan yang tepat.'
				}
			]}

			{#each steps as _, index}
				{#key index}
					<figure bind:this={cards[index]} class="group relative h-fit rounded-2xl">
						<img
							src={_.img}
							class="h-60 w-full rounded-xl object-cover brightness-70 transition-all duration-500 group-hover:brightness-40 md:h-120"
							alt=""
						/>
						<div
							class="border-light-200 absolute top-4 right-4 rounded-full border bg-white/30 px-2 py-1 text-white backdrop-blur-xs max-md:text-sm md:px-4 md:py-2"
						>
							{_.step}
						</div>
						<article class="absolute bottom-4 left-4">
							<h2 class="_tutorial_title">{_.title}</h2>
							<p
								class="text-light-500 max-h-0 overflow-hidden pr-4 transition-[max-height] duration-600 ease-in-out group-hover:max-h-[500px] max-md:text-sm"
							>
								{_.description}
							</p>
						</article>
					</figure>
				{/key}
			{/each}
		{/snippet}
		<div class="grid gap-8 md:grid-cols-3 md:gap-16">
			<article>
				<h2
					bind:this={steps_title}
					class=" text-start text-2xl leading-snug font-semibold md:text-4xl"
				>
					Bagaimana anda melakukan <span class="rounded-full bg-amber-500 px-4 text-white"
						>laporan</span
					> kerusakan fasilitas?
				</h2>
			</article>
			<div class="grid gap-4 md:col-span-2 md:grid-cols-3">
				{@render steps()}
			</div>
		</div>
	</section>

	<Divider />
	<!-- Quotes Section -->
	<section class="my-12 flex justify-center md:my-24">
		<h1
			bind:this={quotes}
			class="font-inter text-dark-500 max-w-[calc(100%-2rem)] text-center text-2xl leading-snug font-semibold tracking-wider md:max-w-[calc(100%-8rem)] md:text-5xl"
		>
			Melihat kerusakan adalah satu hal, namun mengambil tindakan untuk <span class="text-amber-500"
				>melaporkannya</span
			>
			adalah wujud nyata kepedulian. Suaramu memiliki <span class="text-amber-500">kekuatan</span>
			untuk membawa <span class="text-amber-500">perubahan</span> positif yang berarti!.
		</h1>
	</section>
	<Divider />

	<!-- CTA -->
	<section
		bind:this={container_cta}
		class="relative flex w-full overflow-clip rounded-2xl pt-5 pb-5 shadow-2xl shadow-amber-500/60 md:pt-24 md:pb-16"
	>
		<img
			src="/images/gradient-amber-2.jpg"
			class="absolute top-0 h-full w-full object-cover brightness-90"
			alt=""
		/>
		<article class="relative m-auto flex flex-col items-center">
			<h2
				bind:this={cta_title}
				class="max-w-[calc(100%-2rem)] text-center text-lg leading-snug text-white md:max-w-[calc(100%-12rem)] md:text-4xl md:font-semibold"
			>
				Sumbangkan kepedulian Anda, laporkan masalah fasilitas, bantu bangun lingkungan yang lebih
				baik!
			</h2>
			<div bind:this={cta_button}>
				<Button style="font-medium max-md:text-xs mt-8 bg-dark-300">Let's Report</Button>
			</div>
		</article>
	</section>
</main>

<style lang="postcss">
	@reference "../app.css";

	._tutorial_title {
		@apply text-base font-semibold text-white uppercase md:text-xl;
	}

	.shadow-gradient-sm {
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}
</style>
