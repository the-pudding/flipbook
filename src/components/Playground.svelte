<script>
	import Canvas from "$components/CanvasArray.svelte";

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
		gif = await renderGif({ frames: paths, width: 320, height: 320, fps: 12 });
		rendering = false;
	}
</script>

<section id="playground">
	<p>
		{@html text}
		<br />
		<small><em>Note: {note}</em></small>
	</p>
	<Canvas bind:this={canvas} bind:paths showFrameIndex={true}>
		<div class="ui" slot="ui">
			<p>Frames:</p>
			<div class="buttons">
				<button class="small" on:click={onAddFrame}>Add</button>
				<button class="small" on:click={onClearFrame}>Clear</button>
				<button class="small" on:click={onPreview}>
					{previewing ? "Stop" : "Play"} Preview</button
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
