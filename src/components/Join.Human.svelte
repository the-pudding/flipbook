<script>
	import { getContext, createEventDispatcher } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");

	const dispatch = createEventDispatcher();

	export let value;

	let canvas;
	let invalid;
	let review;
	let isHuman;
	let path;

	function onSubmit() {
		invalid = undefined;
		if (review) return;
		if (path.length > 4) {
			review = true;
			canvas.addMessage(copy.join.humanReview);
			setTimeout(() => {
				review = false;
				canvas.addMessage(undefined);
				dispatch("update", { isHuman, path });
			}, 1500);
		} else canvas.addMessage("You must draw.");
	}
</script>

<fieldset>
	<div class="step human">
		<div>
			<label for="human">{@html copy.join.humanLabel}</label>
			<input type="checkbox" id="human" name="human" bind:checked={isHuman} />
		</div>
		<div class="draw" class:visible={isHuman}>
			<p>{@html copy.join.humanPrompt}</p>
			<Canvas bind:this={canvas} bind:path disabled={review} />
		</div>
	</div>
</fieldset>

{#if isHuman}
	<button
		disabled={review || value === "Submitting..."}
		on:click|preventDefault={onSubmit}>{value}</button
	>
{/if}

{#if invalid}
	<p class="invalid">{invalid}</p>
{/if}

<style>
	.human {
		margin: 0;
	}

	.draw {
		display: none;
		margin: 0;
	}

	.draw.visible {
		display: block;
	}

	.draw p {
		margin: 0;
	}
</style>
