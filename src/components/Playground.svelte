<script>
	import Canvas from "$components/Canvas.svelte";
	// import PlusCircle from "lucide-svelte/icons/plus-circle";
	// import MinusCircle  from "lucide-svelte/icons/minus-circle";
	// impor Clapperboard  from "lucide-svelte/icons/clapperboard";

	import renderGif from "$utils/renderGif.js";

	export let text = "Make an animation!";

	let canvas;
	let paths;
	let gif;
	let rendering;
	let previewing;

	function onAddFrame() {
		canvas.addFrame();
	}

	function onDeleteFrame() {
		canvas.deleteFrame();
	}

	function onPreview() {
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
	<p>{@html text}</p>
	<Canvas bind:this={canvas} bind:paths>
		<div slot="ui">
			<span>Frames: </span>
			<button on:click={onAddFrame}>Add</button>
			<button on:click={onDeleteFrame}>Delete</button>
			<button on:click={onPreview}
				>{previewing ? "Stop" : "Play"} Preview</button
			>
		</div>
	</Canvas>
	<button disabled={rendering} on:click={share}
		>{rendering ? "Rendering Animation" : "Share Animation"}</button
	>

	{#if gif}
		<div class="share">
			<a class="btn" href={gif} download="animation.gif">Download</a>
			<img src={gif} alt="animation" />
		</div>
	{/if}
</section>

<style>
	#playground {
		margin: 32px 0;
	}

	p {
		margin: 0;
	}

	.share {
		margin: 16px auto;
	}
</style>
