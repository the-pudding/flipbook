<script>
	import { onMount } from "svelte";
	export let shortcode;
	export let frame_index;
	export let animation_id;

	let d;
	onMount(async () => {
		const root = "https://pudding.cool/projects/flipbook-data/drawings";
		const url = `${root}/${animation_id}/${shortcode}.txt?version=${Date.now()}`;
		const response = await fetch(url);
		d = await response.text();
	});
</script>

<div>
	<p>{frame_index}</p>
	<svg width="160" height="160" viewBox="0 0 320 320">
		{#if d}
			<path {d}></path>
		{/if}
	</svg>
</div>

<style>
	div {
		position: relative;
		margin-right: 8px;
	}

	svg {
		display: block;
		background: white;
		border: 2px dashed var(--color-fg);
	}

	svg path {
		stroke: var(--color-fg);
		stroke-width: 4px;
		fill: none;
	}

	p {
		position: absolute;
		top: 8px;
		right: 8px;
		margin: 0;
		font-size: 14px;
	}
</style>
