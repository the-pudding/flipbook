<script>
	import { onMount, getContext } from "svelte";
	import Notify from "$components/Join.Notify.svelte";
	import Human from "$components/Join.Human.svelte";
	import submit from "$utils/submit.js";
	const copy = getContext("copy");
	const data = getContext("data");

	let formSteps = [Notify, Human];
	let step = 0;
	let isHuman;
	let email;
	let phone;
	let timezone;
	let showForm;
	let reversed;
	let frameCount;
	let waitingCount;
	let submitting;
	let response;

	async function join() {
		if (isHuman) {
			submitting = true;
			try {
				response = await submit("pool", { email, phone, timezone });
				isHuman = undefined;
				email = undefined;
				phone = undefined;
				step = 0;
			} catch (err) {
				response = err;
			} finally {
				submitting = false;
				showForm = false;
			}
		}
	}

	function onUpdate({ detail }) {
		phone = detail?.phone || phone;
		email = detail?.email || email;
		isHuman = detail?.isHuman || isHuman;

		if (step === 0) step += 1;
		else join();
	}

	$: result = response ? JSON.stringify(response) : "";
	onMount(() => {
		const offsetInMinutes = new Date().getTimezoneOffset();
		timezone = offsetInMinutes / 60;

		reversed = Math.random() < 0.5;
		if (reversed) formSteps.reverse();

		formSteps = [...formSteps];

		frameCount = "9,999";
		waitingCount = "123";
	});
</script>

<section id="intro">
	<h1>
		{@html copy.cta}
	</h1>
	<p>
		{@html copy.definition}
	</p>

	<p class="stats">
		<strong>{frameCount}</strong>
		{copy.statsFrames}<br />
		<strong>{waitingCount}</strong>
		{copy.statsWaiting}
	</p>
	<button on:click={() => (showForm = true)}>Get in line!</button>
</section>

<div id="join" class:visible={showForm}>
	<div class="bg" />
	{#if submitting}
		<section class="submitting">
			<p>Adding you to the line...</p>
		</section>
	{:else}
		<section class="fg" class:submitting>
			<button
				aria-label="close"
				class="close"
				on:click={() => (showForm = false)}>X</button
			>
			<form class="shadow" on:submit|preventDefault>
				<p class="prompt"><strong>{@html copy.prompt}</strong></p>

				<div class="steps">
					<svelte:component
						this={formSteps[step]}
						on:update={onUpdate}
						value={step === 0 ? "Next" : "Submit"}
					/>
				</div>
			</form>
		</section>
	{/if}
</div>

{#if result}
	<section class="result">
		<p>{result}</p>
	</section>
{/if}

<style>
	#join {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		z-index: var(--z-overlay);
		width: 100vw;
		height: 100vh;
	}

	#join.visible {
		display: block;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--color-bg);
		opacity: 0.9;
	}

	#join section {
		position: relative;
		background: var(--color-bg);
	}

	.submitting {
		padding-top: 64px;
	}

	.close {
		position: absolute;
		top: 16px;
		right: 16px;
	}
</style>
