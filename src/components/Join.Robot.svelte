<script>
	import { getContext, createEventDispatcher } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");

	const dispatch = createEventDispatcher();

	export let value;

	let invalid;
	let isNotRobot;
	let path;

	function onSubmit() {
		if (path.length) dispatch("update", { isNotRobot });
		else invalid = "You must draw a circle";
	}
</script>

<fieldset>
	<div class="step robot">
		<p>{@html copy.stepRobot}</p>
		<div>
			<label for="robot">I’m not a robot</label>
			<input
				type="checkbox"
				id="robot"
				name="robot"
				bind:checked={isNotRobot}
			/>
		</div>
		<div class="draw" class:visible={isNotRobot}>
			<p>{@html copy.robot}</p>
			<Canvas robot={true} bind:path />
		</div>
	</div>
</fieldset>

{#if isNotRobot}
	<button on:click|preventDefault={onSubmit}>{value}</button>
{/if}
{#if invalid}
	<p class="invalid">{invalid}</p>
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
</style>
