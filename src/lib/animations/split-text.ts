import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
export function revealSplitText(
	target: HTMLElement,
	options = {},
	timeline?: GSAPTimeline,
	position: gsap.Position = '>'
) {
	const split = new SplitText(target, {
		type: 'chars, words, lines',
		mask: 'lines',
		...options
	});

	const words = split.words;
	const tl = timeline || gsap.timeline();

	const tween = gsap.from(words, {
		yPercent: 130,
		autoAlpha: 0,
		stagger: 0.02,
		ease: 'back.out',
		duration: 1,
		...options
	});

	if (timeline) {
		timeline.add(tween, position);
	}

	return tl;
}
