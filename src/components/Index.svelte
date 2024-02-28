<script>
	import { onMount, getContext } from "svelte";
	import { format } from "d3";
	import Notify from "$components/Join.Notify.svelte";
	import Human from "$components/Join.Human.svelte";
	import Draw from "$components/Draw.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import submit from "$utils/submit.js";
	import storage from "$utils/localStorage.js";
	import getParam from "$utils/getParam.js";

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

	let showForm;
	let reversed;
	let submitting;
	let poolResponse;
	let previousShortcode;
	let animationId;
	let frameCount = 0;

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
				poolResponse = { message: err.message };
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
		reversed = Math.random() < 0.5;
		if (reversed) formSteps.reverse();

		formSteps = [...formSteps];
		showForm = getParam("signup");

		const url = "https://pudding.cool/projects/trace-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		const data = await response.json();
		// TODO remove test
		previousShortcode = "test";
		animationId = 1;
		frameCount = format(",")(data.frames || 0);
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
				<p>Error: {poolResponse.message}</p>
				<p>
					Please try again, or contact russell@pudding.cool if the problem
					persists.
				</p>
			</details>
		</div>
	{:else}
		<p>
			{@html copy.definition}
			<br />
			<span class="stats" class:visible={statsVisible}>
				<strong>{frameCount}</strong>
				{copy.statsFrames}
			</span>
		</p>
	{/if}
</section>

<Draw {animationId} {previousShortcode}></Draw>

<footer>
	<section>
		<p>{@html copy.recirc}</p>
	</section>
</footer>

<style>
	#join {
		display: none;
		position: fixed;
		overflow: auto;
		top: 0;
		left: 0;
		z-index: var(--z-overlay);
		width: 100%;
		height: 100vh;
		border: 2vw solid var(--color-fg);
		background: var(--color-bg);
		padding-top: 16px;
	}

	#join.visible {
		display: block;
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
		width: 2em;
		aspect-ratio: 1;
		top: 16px;
		right: 16px;
		z-index: 1;
	}

	.issue {
		color: var(--color-secondary);
		margin: 32px auto;
	}

	#sell > div {
		margin-bottom: 15vh;
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

	footer {
		margin: 64px auto;
	}
</style>
