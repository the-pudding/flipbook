<script>
	import { createEventDispatcher, getContext, tick } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import server from "$utils/server.js";
	import getParam from "$utils/getParam.js";
	import generateId from "$utils/generateId.js";
	import { userData } from "$stores/misc.js";

	export let animationId;
	export let prevFrameIndex;
	export let prevShortcode;

	const copy = getContext("copy");

	const base = "https://pudding.cool/projects/flipbook-data/drawings";
	const buttonText = copy.spread;
	const url = copy.url;
	const title = copy.title;
	const dispatch = createEventDispatcher();

	let path;
	let preset;
	let error;
	let canvas;

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
					await tick();
					dispatch("done");
				} else {
					// TODO
					error =
						"Sorry! There was an issue submitting your drawing. Please refresh the page or try again later.";
					console.log({ status, message });
				}
			}
		} catch (err) {
			error =
				"Sorry! There was an issue submitting your drawing. Please refresh the page or try again later.";
			console.log(err);
		}
	}

	async function loadDrawing() {
		try {
			const url = `${base}/${animationId}/${prevShortcode}.txt?version=${Date.now()}`;
			const response = await fetch(url);
			preset = await response.text();
		} catch (err) {
			error =
				"Sorry. We had trouble loading the previous drawing. Please try again later.";
			console.log(err);
		}
	}

	$: nextFrameIndex = prevFrameIndex + 1;
	$: loadDrawing(prevShortcode);
</script>

<section>
	{#if error}
		<p class="error"><strong>{error}</strong></p>
	{:else if preset}
		<p>
			{@html copy.draw.task}
			<br />
			<em>Note: {copy.draw.note}</em>
		</p>
		<Canvas bind:this={canvas} bind:path {preset} on:validate={onValidate}>
			<div class="ui" slot="ui">
				<div class="buttons">
					<button class="small" on:click={onSubmit}>Submit</button>
					<button class="small" on:click={onClear}>Clear</button>
				</div>
			</div>
		</Canvas>
	{:else}
		<div class="spacer"></div>
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
		flex: 1;
		margin-bottom: 8px;
		margin-right: 8px;
	}

	button:last-of-type {
		margin-right: 0;
	}

	.spacer {
		height: 500px;
	}
</style>
