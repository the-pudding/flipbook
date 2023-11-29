<script>
	import { onMount, getContext } from "svelte";
	import { format } from "d3";
	import Notify from "$components/Join.Notify.svelte";
	import Human from "$components/Join.Human.svelte";
	import Playground from "$components/Playground.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import submit from "$utils/submit.js";
	import storage from "$utils/localStorage.js";

	const copy = getContext("copy");

	const buttonText = copy.spread;
	const url = copy.url;
	const title = copy.title;

	let formSteps = [Notify, Human];
	let step = 0;
	let statsVisible;

	let isHuman;
	let email;
	let phone;
	let path;

	let timezone;

	let showForm;
	let reversed;
	let frameCount = "0";
	let waitingCount = "0";
	let submitting;
	let poolResponse;

	async function join() {
		if (isHuman) {
			submitting = true;
			try {
				poolResponse = await submit("pool", { email, phone, timezone });
				isHuman = undefined;
				email = undefined;
				phone = undefined;
				step = 0;
			} catch (err) {
				poolResponse = { error: err.message };
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
		path = detail?.path || path;

		const humanInStorage = storage.get("pudding_trace_human");

		if (path && !humanInStorage)
			submit("human", {
				drawing: path,
				has_phone: !!phone,
				has_email: !!email
			})
				.then(({ duration, message }) => {
					console.log(duration, message);
					storage.set("pudding_trace_human", true);
				})
				.catch((err) => {
					console.log(err);
				});

		if (step === 0) step += 1;
		else join();
	}

	$: joined = poolResponse?.status === 200;

	onMount(async () => {
		const offsetInMinutes = new Date().getTimezoneOffset();
		timezone = offsetInMinutes / 60;

		reversed = Math.random() < 0.5;
		if (reversed) formSteps.reverse();

		formSteps = [...formSteps];

		const url = "https://pudding.cool/projects/trace-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		const data = await response.json();
		frameCount = format(",")(data.frames || 0);
		waitingCount = format(",")(data.waiting || 0);
		statsVisible = true;
		console.log("updated", data.timestamp);
	});
</script>

<section id="intro">
	<h1>
		{@html copy.cta}
	</h1>
	{#if joined}
		<p>{copy.thanks}</p>
		<p><ShareButton {buttonText} {title} {url} /></p>
	{:else if poolResponse}
		<div class="issue">
			<details>
				<summary>{copy.issue} </summary>
				Error: {poolResponse.error}
			</details>
		</div>
	{:else}
		<p>
			{@html copy.definition}
		</p>

		<p class="stats" class:visible={statsVisible}>
			<strong>{frameCount}</strong>
			{copy.statsFrames}<br />
			<strong>{waitingCount}</strong>
			{copy.statsWaiting}
		</p>
	{/if}
</section>

{#if !joined}
	<section id="sell">
		<div class="nothing">
			<button on:click={() => (showForm = true)}>Get in line!</button>
		</div>

		<div class="hard">
			<p>{@html copy.hard}</p>
			<img src="assets/demo/test.jpg" alt="test" />
			<p>{@html copy.hard2}</p>
			<button on:click={() => (showForm = true)}>Get in line!</button>
		</div>

		<div class="harder">
			<p>{@html copy.harder}</p>
			<ul>
				{#each copy.harderLi as item}
					<li>{@html item}</li>
				{/each}
			</ul>
			<button on:click={() => (showForm = true)}>Get in line!</button>
		</div>
	</section>
{/if}

{#if joined}
	<Playground text={copy.playground} />
{/if}
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

	.issue {
		color: red;
	}

	#sell > div {
		margin-bottom: 128px;
	}

	ul {
		margin: 16px 0;
	}

	.stats {
		visibility: hidden;
	}

	.stats.visible {
		visibility: visible;
	}
</style>
