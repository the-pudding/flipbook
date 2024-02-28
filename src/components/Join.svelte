<script>
	import { onMount, getContext } from "svelte";
	import Notify from "$components/Join.Notify.svelte";
	import Human from "$components/Join.Human.svelte";
	import submit from "$utils/server.js";
	import storage from "$utils/localStorage.js";

	const copy = getContext("copy");

	let isHuman;
	let email;
	let phone;
	let formSteps = [Notify, Human];
	let step = 0;

	let showForm;
	let reversed;
	let submitting;

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

		const humanInStorage = storage.get("pudding_flipbook_human");

		if (path && !humanInStorage)
			submit("human", {
				drawing: path,
				has_phone: !!phone,
				has_email: !!email
			})
				.then(({ duration, message }) => {
					console.log(duration, message);
					storage.set("pudding_flipbook_human", true);
				})
				.catch((err) => {
					console.log(err);
				});

		if (step === 0) step += 1;
		else join();
	}

	function setupForm() {
		reversed = Math.random() < 0.5;
		if (reversed) formSteps.reverse();

		formSteps = [...formSteps];
		showForm = getParam("signup");
	}

	$: joined = poolResponse?.status === 200;

	onMount(() => {
		setupForm();
	});
</script>

<div id="join" class:visible={showForm}>
	<button aria-label="close" class="close" on:click={() => (showForm = false)}
		>X</button
	>
	{#if submitting}
		<section class="submitting">
			<p>Adding you to the line...</p>
		</section>
	{:else}
		<section class="fg" class:submitting>
			<form class="shadow" on:submit|preventDefault>
				<h2>{@html copy.prompt}</h2>

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
</style>
