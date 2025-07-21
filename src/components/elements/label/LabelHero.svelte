<script lang="ts">
	let { icon, text } = $props();
</script>

<li class="bg-light-300 flex items-center justify-between rounded-full px-4 py-2">
	<figure class=" text-gray-800">
		{@render icon()}
	</figure>
	<p class="font-semibold uppercase">{@render text()}</p>
</li>
