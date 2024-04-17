<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { range, format } from "d3";
	import loadImage from "$utils/loadImage.js";
	let slider = 0;
	let animation = "1";

	const preloaded = [];

	async function preload(dir) {
		if (preloaded.includes(dir)) return;
		const paths = range(360).map(
			(i) => `assets/animations/${dir}/${format("05")(i)}.png`
		);
		const images = await Promise.all(paths.map(loadImage));
		preloaded.push(dir);
	}

	$: index = format("05")(+slider);
	$: if (browser && animation !== "1") preload(animation);

	onMount(() => {
		setTimeout(() => {
			preload(animation);
		}, 5000);
	});
</script>

<div class="starting">
	<p>Starting image:</p>
	<select bind:value={animation}>
		<option value="1">Line</option>
		<option value="2">Triangle</option>
		<option value="3">Circle</option>
		<option value="4">Fish</option>
		<option value="5">Spiral</option>
		<option value="6">Texas</option>
	</select>
</div>

<figure>
	<p class="frame">{+slider + 1}</p>
	<img src="assets/animations/{animation}/{index}.png" alt="frame" />
</figure>

<input type="range" min="0" max="359" bind:value={slider} />

<style>
	figure {
		position: relative;
		margin: 8px auto 16px auto !important;
	}

	img {
		display: block;
		border: 2px solid var(--color-fg);
	}

	figure:before {
		position: absolute;
		content: "";
		display: block;
		border-top: 2px solid var(--color-bg);
		top: 50%;
		left: 2px;
		width: calc(100% - 4px);
		height: 1px;
		z-index: 1;
	}

	figure:after {
		position: absolute;
		content: "";
		display: block;
		border-right: 2px solid var(--color-bg);
		left: 50%;
		top: 2px;
		height: calc(100% - 4px);
		width: 1px;
		z-index: 1;
	}

	.frame {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		line-height: 1;
		padding: 8px;
		z-index: 1;
		font-size: 12px;
		font-family: var(--mono);
	}

	.starting {
		display: flex;
		align-items: center;
		margin: 32px 8px 0 0;
		user-select: none;
	}
	.starting p {
		margin: 0;
		margin-right: 8px;
		line-height: 1;
	}

	.starting select {
		line-height: 1;
		padding: 4px;
	}

	input {
		display: block;
		width: 100%;
		margin-bottom: 32px;
	}
</style>
