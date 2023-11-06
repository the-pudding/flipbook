<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import { PlusCircle, MinusCircle, Clapperboard } from "lucide-svelte";
	import renderGif from "$utils/renderGif.js";

	const copy = getContext("copy");

	let canvas;
	let paths;

	function addFrame() {
		canvas.addFrame();
	}

	function deleteFrame() {
		canvas.deleteFrame();
	}

	function preview() {
		canvas.preview();
	}

	function share() {
		renderGif({ frames: paths, width: 300, height: 300 });
	}
</script>

<section id="playground">
	<p>{@html copy.playground}</p>
	<Canvas bind:this={canvas} bind:paths>
		<div slot="ui">
			<button on:click={addFrame}>Add</button>
			<button on:click={deleteFrame}>Delete</button>
			<button on:click={preview}>Preview</button>
		</div>
	</Canvas>
	<button on:click={share}>Share Animation</button>
</section>
