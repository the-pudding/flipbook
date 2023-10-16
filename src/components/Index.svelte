<script>
	import { onMount, getContext } from "svelte";
	import Notify from "$components/Join.Notify.svelte";
	import Robot from "$components/Join.Robot.svelte";
	const copy = getContext("copy");
	const data = getContext("data");

	let formSteps = [Notify, Robot];
	let step = 0;
	let nextDisabled;
	let isNotRobot;
	let email;
	let phone;
	let invalid;
	let utcOffset;
	let showForm;
	let reversed;
	let statsEl;

	function onSubmit() {
		if (step === 0) {
			step = 1;
			if (!reversed) nextDisabled = true;
		} else {
			console.log({ email, phone, isNotRobot, utcOffset });
			showForm = false;
		}
	}

	function onUpdate({ detail }) {
		phone = detail?.phone;
		email = detail?.email;
		isNotRobot = detail?.isNotRobot;
		invalid = detail?.invalid;

		nextDisabled = !isNotRobot;
	}

	onMount(() => {
		const offsetInMinutes = new Date().getTimezoneOffset();
		utcOffset = offsetInMinutes / 60;

		reversed = Math.random() < 0.5;
		if (reversed) formSteps.reverse();

		formSteps = [...formSteps];

		nextDisabled = !!reversed;

		statsEl.querySelector(".count-frames").textContent = "9,999";
		statsEl.querySelector(".count-people").textContent = "123";
	});
</script>

<section id="intro">
	<h1>
		{@html copy.cta}
	</h1>
	<p>
		{@html copy.definition}
	</p>

	<p class="stats" bind:this={statsEl}>{@html copy.stats}</p>
	<button on:click={() => (showForm = true)}>Get in line</button>
</section>

<div id="join" class:visible={showForm}>
	<div class="bg" />
	<section class="fg">
		<button on:click={() => (showForm = false)}>Close</button>
		<form class="shadow" on:submit|preventDefault={onSubmit}>
			<p class="prompt"><strong>{@html copy.prompt}</strong></p>

			<div class="steps">
				<svelte:component this={formSteps[step]} on:update={onUpdate} />
			</div>
			<p>
				<!-- {#if step === 0}
					<button disabled={nextDisabled} on:click={onNext}>Next</button>
				{:else} -->
				{#if !nextDisabled}
					<input type="submit" value={step === 0 ? "Next" : "Submit"} />
				{/if}
				<!-- {/if} -->
			</p>
		</form>
	</section>
</div>

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

	.fg {
		position: relative;
		background: var(--color-bg);
	}
</style>
