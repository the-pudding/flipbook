<script>
	import { getContext, createEventDispatcher } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");

	const dispatch = createEventDispatcher();
	let isNotRobot;

	$: dispatch("update", { isNotRobot });
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
			<Canvas robot={true} />
		</div>
	</div>
</fieldset>

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
