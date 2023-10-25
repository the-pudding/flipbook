<script>
	import { getContext, createEventDispatcher } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");

	const dispatch = createEventDispatcher();

	export let value;

	let invalid;
	let review;
	let isHuman;
	let path;

	function onSubmit() {
		if (review) return;

		if (path.length) {
			review = true;
			setTimeout(() => {
				review = false;
				dispatch("update", { isHuman });
			}, 1500);
		} else invalid = "You must draw a circle";
	}
</script>

<fieldset>
	<div class="step robot">
		<div>
			<label for="robot">Are you a human?</label>
			<input type="checkbox" id="robot" name="robot" bind:checked={isHuman} />
		</div>
		<div class="draw" class:visible={isHuman}>
			<p>{@html copy.robot}</p>
			<Canvas robot={true} bind:path disabled={review} />
		</div>
	</div>
</fieldset>

{#if isHuman}
	<button disabled={review} on:click|preventDefault={onSubmit}>{value}</button>
{/if}

{#if invalid}
	<p class="invalid">{invalid}</p>
{/if}

{#if review}
	<p class="review">Eh. Good enough.</p>
{/if}

<style>
	.robot {
		margin: 0;
	}

	input[type="checkbox"] {
		width: 1.5em;
		height: 1.5em;
	}

	.draw {
		display: none;
		margin: 0;
	}

	.draw.visible {
		display: block;
	}

	.invalid {
		color: red;
	}
</style>
