<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let { style, disabled = false, children, ...props }: buttonProps = $props();

	interface buttonProps {
		style?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset' | null;
		onclick?: () => void;
		children: any;
		name?: string;
	}

	let mix_class = twMerge(
		'focus:shadow-outline active:scale-95 flex rounded-full py-2 px-4 text-white justify-center focus:outline-none cursor-pointer bg-amber-600 hover:opacity-90 hover:animate:pulse',
		style
	);
</script>

<button class={mix_class} {...props} {disabled} aria-label="Kembali">
	{@render children()}
</button>
