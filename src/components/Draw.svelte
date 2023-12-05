<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import submit from "$utils/submit.js";
	import getParam from "$utils/getParam.js";

	const copy = getContext("copy");

	const base = "https://pudding.cool/projects/trace-data/drawings";

	let shortcode;
	let loading;
	let path;
	let preset;
	let error;
	let canvas;
	let animationId;

	let complete;

	async function onStart() {
		shortcode = getParam("id");
		loading = true;
		try {
			const result = await submit("checkin", { shortcode });

			if (result.status === 200) {
				const { id, prev_shortcode, done } = result.data;
				if (done) complete = true;
				else {
					const response = await fetch(`${base}/${id}/${prev_shortcode}.txt`);
					preset = await response.text();
				}
			} else if (result.status === 404) error = "Oh no! This turn has expired.";
			else {
				error = result.message || "Oh no! Something went wrong.";
			}
		} catch (err) {
			error = `Error: ${err.message}`;
		} finally {
			loading = false;
		}
	}

	function onSubmit() {
		canvas.addFrame();
	}

	async function onRejoin() {
		try {
			const response = await submit("rejoin", { shortcode });
			console.log(response);
			// TODO
			alert("rejoined");
		} catch (err) {
			console.log(err);
		}
	}

	async function onValidate({ detail }) {
		try {
			if (detail) {
				const response = await submit("submit", {
					shortcode,
					drawing: path
				});
				console.log(response);
				complete = true;
			}
		} catch (err) {
			console.log(err);
		}
	}
</script>

<section>
	{#if complete}
		<p>{@html copy.draw.done}</p>
		<p><button on:click={onRejoin}>Get in line again</button></p>
	{:else}
		<p>{@html copy.draw.thanks}</p>

		{#if !preset && !error}
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
			<p><a class="btn" href="/?signup=true">Get in line again</a></p>
		{/if}

		{#if preset}
			<Canvas bind:this={canvas} bind:path {preset} on:validate={onValidate}>
				<div slot="ui">
					<button on:click={onSubmit}>Submit</button>
				</div>
			</Canvas>
		{/if}
	{/if}
</section>
