<script>
	import { onMount, getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import server from "$utils/server.js";
	import getParam from "$utils/getParam.js";
	import generateId from "$utils/generateId.js";
	import { userData } from "$stores/misc.js";

	const copy = getContext("copy");

	const base = "https://pudding.cool/projects/flipbook-data/drawings";

	const buttonText = copy.spread;
	const url = copy.url;
	const title = copy.title;

	export let animationId;
	export let animationFrameIndex;
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
				const response = await server("submit", {
					userId: $userData.id,
					animationId,
					previousShortcode,
					drawing: path
				});

				// store locally
				const { status, shortcode } = response;
				const timestamp = Date.now();
				if (status === 200) {
					$userData?.submissions?.push({
						animationId,
						animationFrameIndex,
						previousShortcode,
						shortcode,
						timestamp
					});
				}
				complete = true;
			}
		} catch (err) {
			// TODO
			console.log(err);
		}
	}

	onMount(async () => {
		try {
			const url = `${base}/${animationId}/${previousShortcode}.txt?version=${Date.now()}`;
			const response = await fetch(url);
			preset = await response.text();
		} catch (err) {
			// TODO
			console.log(err);
		}
	});
</script>

<section>
	{#if complete}
		<p>{@html copy.draw.done}</p>
	{:else}
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
