<script>
	import Canvas from "$components/Canvas.svelte";
	// import PlusCircle from "lucide-svelte/icons/plus-circle";
	// import MinusCircle  from "lucide-svelte/icons/minus-circle";
	// impor Clapperboard  from "lucide-svelte/icons/clapperboard";

	import renderGif from "$utils/renderGif.js";

	export let text = "Make an animation!";
	export let note;

	let canvas;
	let paths;
	let gif;
	let rendering;
	let previewing;

	function onAddFrame() {
		canvas.addFrame();
	}

	function onClearFrame() {
		canvas.clearFrame();
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
	<p>
		{@html text}
		<br />
		<em>Note: {note}</em>
	</p>
	<Canvas bind:this={canvas} bind:paths showFrameIndex={true}>
		<div class="ui" slot="ui">
			<p>Frames:</p>
			<div class="buttons">
				<button on:click={onAddFrame}><small>Add</small></button>
				<button on:click={onClearFrame}><small>Clear</small></button>
				<button on:click={onPreview}
					><small> {previewing ? "Stop" : "Play"} Preview</small></button
				>
			</div>
		</div>
	</Canvas>
	<div class="render">
		<button disabled={rendering} on:click={share}
			>{rendering ? "Rendering" : "Share"}</button
		>
	</div>

	{#if gif}
		<div class="share">
			<a role="button" href={gif} download="animation.gif">Download</a>
			<img src={gif} alt="animation" />
		</div>
	{/if}
</section>

<style>
	#playground {
		margin: 32px 0;
	}

	p {
		/* margin: 0; */
	}

	.ui .buttons {
		display: flex;
		flex-wrap: wrap;
		max-width: var(--canvas-size);
		width: 100%;
		height: auto;
		background: var(--color-bg);
	}

	button {
		margin: 0;
		display: flex;
		margin-bottom: 8px;
		margin-right: 8px;
	}

	.render {
		margin: 32px auto;
	}

	.share {
		margin: 32px auto;
	}
</style>
