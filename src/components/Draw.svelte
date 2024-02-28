<script>
	import { onMount, getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import submit from "$utils/submit.js";
	import getParam from "$utils/getParam.js";

	const copy = getContext("copy");

	const base = "https://pudding.cool/projects/trace-data/drawings";

	const buttonText = copy.spread;
	const url = copy.url;
	const title = copy.title;

	export let animationId;
	export let previousShortcode;

	let path;
	let preset;
	let error;
	let canvas;

	let complete;

	function onSubmit() {
		canvas.addFrame();
	}

	function onClear() {
		canvas.resetFrame();
	}

	async function onValidate({ detail }) {
		try {
			if (detail) {
				// const response = await submit("submit", {
				// 	shortcode,
				// 	drawing: path
				// });
				// console.log(response);
				console.log("todo: submit");
				complete = true;
			}
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		const url = `${base}/${animationId}/${previousShortcode}.txt`;
		const response = await fetch(url);
		preset = await response.text();
	});
</script>

<section>
	{#if complete}
		<p>{@html copy.draw.done}</p>
		{#if rejoinError}
			<div class="issue">
				<details>
					<summary>{copy.issue} </summary>
					Error: {rejoinError}
				</details>
			</div>
		{:else if rejoined}
			<p>{copy.rejoined}</p>
			<p><ShareButton {buttonText} {title} {url} /></p>
		{:else}
			<p><button on:click={onRejoin}>Join again</button></p>
		{/if}
	{:else}
		<!-- <p>{@html copy.draw.thanks}</p> -->

		{#if !preset && !error}
			<!--  -->
		{/if}

		{#if preset}
			<p>
				{@html copy.draw.task}
				<br />
				<em>Note: {copy.draw.note}</em>
			</p>
		{/if}

		{#if error}
			<p class="error"><strong>{error}</strong></p>
			<p><a href="/?signup=true">Join again</a></p>
		{/if}

		{#if preset}
			<Canvas bind:this={canvas} bind:path {preset} on:validate={onValidate}>
				<div class="ui" slot="ui">
					<div class="buttons">
						<button on:click={onSubmit}><small>Submit</small></button>
						<button on:click={onClear}><small>Clear</small></button>
					</div>
				</div>
			</Canvas>
		{:else}
			<div class="loading"></div>
		{/if}
	{/if}
</section>

<style>
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

	.loading {
		height: 500px;
	}
</style>
