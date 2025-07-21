import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateIn(target: Element | Element[], options = {}) {
	gsap.from(target, {
		opacity: 0,
		y: 30,
		duration: 0.4,
		ease: 'power2.out',
		stagger: 0.2,
		scrollTrigger: {
			trigger: target,
			start: 'top bottom',
			toggleActions: 'play none none reverse'
		},
		...options
	});
}
