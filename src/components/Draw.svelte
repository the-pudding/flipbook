<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import submit from "$utils/submit.js";

	const copy = getContext("copy");

	const base = "https://pudding.cool/projects/trace-data/drawings";

	let loading;
	let path;
	let preset;
	let error;
	let canvas;

	async function onStart() {
		loading = true;
		try {
			const result = await submit("checkin", { shortcode: "abcdefgh" });
			if (result.status === 200) {
				const { id, prev_shortcode } = result.data;
				const response = await fetch(`${base}/${id}/${prev_shortcode}.txt`);
				preset = await response.text();
			} else if (result.status) {
				if (result.data.message === "shortcode not found")
					error = "Oh no! This turn has expired.";
				else
					error =
						"It looks like you got a bad link or just made it up in hopes of skipping the line. Want to join?";
			} else {
				error = result.message || "Oh no! Something went wrong.";
			}
		} catch (err) {
			error = `Error: ${err.message}`;
		}
	}

	function onSubmit() {
		canvas.addFrame();
	}

	function validate({ detail }) {
		console.log(detail);
		console.log(path);
	}
</script>

<section>
	<p>{@html copy.draw.thanks}</p>

	{#if !preset}
		<button disabled={loading} on:click={onStart}
			>{loading ? "Loading..." : "Start"}</button
		>
	{/if}

	{#if preset}
		<p>
			{@html copy.draw.task}
			<em>Note: {copy.draw.note}</em>
		</p>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if preset}
		<Canvas bind:this={canvas} validate={true} bind:path {preset} on:validate>
			<div slot="ui">
				<button on:click={onSubmit}>Submit</button>
			</div>
		</Canvas>
	{/if}
</section>
