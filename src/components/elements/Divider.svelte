<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let logoEl: HTMLElement;
	let lineLeft: HTMLElement;
	let lineRight: HTMLElement;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);
		gsap.set(lineLeft, { transformOrigin: 'right center', scaleX: 0 });
		gsap.set(lineRight, { transformOrigin: 'left center', scaleX: 0 });
		gsap.set(logoEl, { scale: 0, opacity: 0 });

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: logoEl,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});

		tl.to(logoEl, {
			scale: 1,
			opacity: 1,
			duration: 1,
			ease: 'back.out(1.7)'
		});

		tl.to(
			[lineLeft, lineRight],
			{
				scaleX: 1,
				duration: 1,
				ease: 'power2.out'
			},
			'<+0.3'
		);
	});
</script>

<div class="my-8 flex w-full items-center justify-center gap-12 md:my-12">
	<span bind:this={lineLeft} class="bg-light-600 h-0.5 w-32 rounded-full"></span>
	<img bind:this={logoEl} src="/images/logo.png" class="h-10 md:h-12" alt="" />
	<span bind:this={lineRight} class="bg-light-600 h-0.5 w-32 rounded-full"></span>
</div>
