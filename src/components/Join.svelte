<script>
	import { onMount, getContext, createEventDispatcher } from "svelte";
	import Notify from "$components/Join.Notify.svelte";
	import Human from "$components/Join.Human.svelte";
	import server from "$utils/server.js";
	import storage from "$utils/localStorage.js";
	import { userData } from "$stores/misc.js";

	const copy = getContext("copy");

	export let reversed;
	export let noCredit;

	let isHuman;
	let email;
	let phone;
	let name;
	let path;
	let platform;
	let formSteps = [Notify, Human];
	let step = 0;
	let sending;

	let showForm;
	let submitting;

	const dispatch = createEventDispatcher();

	async function onUpdate({ detail }) {
		try {
			phone = detail?.phone || phone;
			email = detail?.email || email;
			name = detail?.name || name;
			platform = detail?.platform || platform;
			isHuman = detail?.isHuman || isHuman;
			path = detail?.path || path;

			const hasInfo = phone || email || name || platform;

			const localHuman = $userData.human;
			sending = true;

			if (step === 0) {
				if (reversed && path && !localHuman) {
					await server("human", {
						drawing: path,
						userId: $userData?.id
					});
					$userData.human = true;
					$userData = $userData;
				} else if (!reversed && hasInfo) {
					await server("notify", {
						phone,
						email,
						name,
						platform,
						userId: $userData?.id
					});
				}
				step += 1;
			} else {
				if (reversed && hasInfo) {
					await server("notify", {
						phone,
						email,
						name,
						platform,
						userId: $userData?.id
					});
				} else if (!reversed && path && !localHuman) {
					await server("human", {
						drawing: path,
						phone,
						email,
						name,
						platform,
						userId: $userData?.id
					});

					$userData.human = true;
					$userData = $userData;
				}
			}
		} catch (err) {
			console.log(err);
		} finally {
			sending = false;
			dispatch("close");
		}
	}

	onMount(() => {
		if (reversed) formSteps = [Human, Notify];
	});
</script>

<div id="join" class:visible={showForm}>
	<button aria-label="close" class="close" on:click={() => dispatch("close")}
		>X</button
	>
	{#if submitting}
		<section class="submitting">
			<p>Submitting...</p>
		</section>
	{:else}
		<section class="fg" class:submitting>
			<form class="shadow" on:submit|preventDefault>
				<h2>{@html copy.join.prompt}</h2>

				<div class="steps">
					<svelte:component
						this={formSteps[step]}
						{noCredit}
						on:update={onUpdate}
						value={sending ? "Submitting..." : step === 0 ? "Next" : "Submit"}
					/>
				</div>
			</form>
		</section>
	{/if}
</div>

<style>
	#join {
		position: fixed;
		overflow: auto;
		top: 0;
		left: 0;
		z-index: var(--z-overlay);
		width: 100%;
		height: 100vh;
		background: var(--color-bg);
		padding-top: 16px;
	}

	#join section {
		position: relative;
		background: var(--color-bg);
	}

	.close {
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 1;
	}
</style>
