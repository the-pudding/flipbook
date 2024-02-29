<script>
	import { getContext } from "svelte";
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
	export let prevFrameIndex;
	export let prevShortcode;

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
				// send to server
				const response = await server("submit", {
					userId: $userData.id,
					animationId,
					prevShortcode,
					nextFrameIndex,
					drawing: path
				});

				const { status, message, shortcode } = response;
				// store locally
				const timestamp = Date.now();
				if (status === 200) {
					const newData = {
						animationId,
						nextFrameIndex,
						prevShortcode,
						shortcode,
						timestamp
					};
					const submissions = [...$userData.submissions, newData];

					$userData = { ...$userData, submissions };
					complete = true;
				} else {
					// TODO
					console.log({ status, message });
				}
			}
		} catch (err) {
			// TODO
			console.log(err);
		}
	}

	async function loadDrawing() {
		try {
			const url = `${base}/${animationId}/${prevShortcode}.txt?version=${Date.now()}`;
			const response = await fetch(url);
			preset = await response.text();
		} catch (err) {
			// TODO
			console.log(err);
		}
	}

	$: nextFrameIndex = prevFrameIndex + 1;
	$: loadDrawing(prevShortcode);
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
						<button class="small" on:click={onSubmit}>Submit</button>
						<button class="small" on:click={onClear}>Clear</button>
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
		display: flex;
		margin-bottom: 8px;
		margin-right: 8px;
	}

	.loading {
		height: 500px;
	}
</style>
