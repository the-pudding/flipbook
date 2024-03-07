<script>
	import { createEventDispatcher, getContext, tick } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import server from "$utils/server.js";
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
	let disabled;
	let inkRem;

	function onSubmit() {
		disabled = true;
		canvas.addFrame();
	}

	function onClear() {
		canvas.resetFrame();
	}

	async function onValidate({ detail }) {
		try {
			if (detail) {
				canvas.addMessage("submitting...");
				let response;
				if ($userData.neato)
					response = { status: 200, shortcode: "neato", message: "" };
				else {
					response = await server("submit", {
						userId: $userData.id,
						animationId,
						prevShortcode,
						nextFrameIndex,
						drawing: path
					});
				}

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

					const index = $userData.submissions.findIndex(
						(d) => d.animationId === animationId
					);
					if (index >= 0) $userData.submissions[index] = newData;
					else $userData.submissions.push(newData);

					$userData = $userData;
					await tick();
					dispatch("done");
				} else {
					error =
						"Sorry! There was an issue submitting your drawing. Please refresh the page or try again later.";
					console.log({ status, message });
				}

				canvas.addMessage();
			}
		} catch (err) {
			error =
				"Sorry! There was an issue submitting your drawing. Please refresh the page or try again later.";
			console.log(err);
		} finally {
			disabled = false;
		}
	}

	async function loadDrawing() {
		try {
			const url = `${base}/${animationId}/${prevShortcode}.txt?version=${Date.now()}`;
			const response = await fetch(url);
			preset = await response.text();
		} catch (err) {
			error =
				"Sorry! There was an issue loading the previous drawing. Please try again later.";
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
		<p class="instructions">
			Instructions: {@html copy.draw.task}
			<br />
			<small
				>{copy.draw.note}
				<span class="ink" style="--ink: {inkRem * 100}%;">{copy.draw.ink}</span
				></small
			>
		</p>
		<Canvas
			bind:this={canvas}
			bind:path
			bind:inkRem
			{preset}
			showFrameIndex={false}
			{disabled}
			on:validate={onValidate}
		>
			<div class="ui" slot="ui">
				<div class="buttons">
					<button {disabled} class="small" on:click={onSubmit}>Submit</button>
					<button {disabled} class="small" on:click={onClear}>Clear</button>
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

	small {
		display: inline-block;
		margin-top: 16px;
	}

	span.ink {
		display: inline-block;
		/* use background-image to create a bottom border that is a percentvalue */
		background-image: linear-gradient(var(--color-fg), var(--color-fg));
		background-size: var(--ink) 4px;
		background-position: 0 100%;
		background-repeat: no-repeat;
	}

	p.instructions {
		margin-bottom: 0px;
	}
</style>
