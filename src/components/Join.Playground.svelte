<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import { PlusCircle, MinusCircle, Clapperboard } from "lucide-svelte";
	import renderGif from "$utils/renderGif.js";

	const copy = getContext("copy");

	let canvas;
	let paths;
	let gif;
	let rendering;
	let previewing;

	function addFrame() {
		canvas.addFrame();
	}

	function deleteFrame() {
		canvas.deleteFrame();
	}

	function preview() {
		canvas.preview();
		previewing = !previewing;
	}

	async function share() {
		rendering = true;
		gif = await renderGif({ frames: paths, width: 300, height: 300 });
		rendering = false;
	}
</script>

<section id="playground">
	<p>{@html copy.playground}</p>
	<Canvas bind:this={canvas} bind:paths>
		<div slot="ui">
			<button on:click={addFrame}>Add</button>
			<button on:click={deleteFrame}>Delete</button>
			<button on:click={preview}>{previewing ? "Stop" : "Play"} Preview</button>
		</div>
	</Canvas>
	<button disabled={rendering} on:click={share}
		>{rendering ? "Rendering Animation" : "Share Animation"}</button
	>
	{#if gif}
		<a class="btn" href={gif} download="animation.gif">Download</a>
		<img src={gif} alt="animation" />
	{/if}
</section>
