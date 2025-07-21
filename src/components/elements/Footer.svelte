<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	gsap.registerPlugin(ScrollTrigger);

	let logo: HTMLElement;
	let copyright: HTMLElement;

	onMount(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: logo.parentElement,
				start: 'top 100%',
				toggleActions: 'play none none reverse'
			}
		});

		tl.from(logo, {
			x: -100,
			opacity: 0,
			duration: 0.6,
			ease: 'power2.out'
		});

		tl.from(
			copyright,
			{
				x: 100,
				opacity: 0,
				duration: 0.6,
				ease: 'power2.out'
			},
			'-=0.4'
		); // overlap sedikit agar smooth
	});
</script>

<footer
	class="border-light-300 flex items-center justify-between overflow-hidden border-t px-8 py-4"
>
	<img bind:this={logo} src="/images/reporthat-logo.png" class="h-8" alt="" />
	<p bind:this={copyright} class=" text-xs md:text-sm">© 2025 Reporthat. All rights reserved</p>
</footer>
