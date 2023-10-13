<script>
	import { onMount, getContext } from "svelte";
	import Notify from "$components/Join.Notify.svelte";
	import Robot from "$components/Join.Robot.svelte";
	const copy = getContext("copy");
	const data = getContext("data");

	let formSteps = [Notify, Robot];
	let step = 0;
	let isNotRobot;
	let email;
	let phone;
	let utcOffset;

	function onSubmit() {
		console.log({ email, phone, isNotRobot, utcOffset });
	}

	function onUpdate({ detail }) {
		if (detail.phone) phone = detail.phone;
		if (detail.email) email = detail.email;
		if (detail.isNotRobot) isNotRobot = detail.isNotRobot;
	}

	onMount(() => {
		const offsetInMinutes = new Date().getTimezoneOffset();
		utcOffset = offsetInMinutes / 60;

		const reversed = Math.random() < 0.5;
		if (reversed) formSteps.reverse();
		formSteps = [...formSteps];
	});
</script>

<section>
	<h1>
		<strong>{@html copy.cta}</strong>
	</h1>
	<p>
		{@html copy.definition}
	</p>
</section>

<section>
	<form class="shadow" on:submit|preventDefault={onSubmit}>
		<p class="prompt"><strong>{@html copy.prompt}</strong></p>

		<div class="steps">
			<svelte:component this={formSteps[step]} on:update={onUpdate} />
		</div>
		<p>
			{#if step === 0}
				<button on:click={() => (step = 1)}>Next</button>
			{:else}
				<input type="submit" value="Submit" />
			{/if}
		</p>
	</form>
</section>

<style>
	.prompt,
	form > div p {
		margin-top: 0;
	}

	.step p {
		margin: 0;
		margin-bottom: 16px;
	}
</style>
