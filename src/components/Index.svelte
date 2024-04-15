<script>
	import { dev, browser } from "$app/environment";
	import { onMount, getContext } from "svelte";
	import { format } from "d3";
	import { detectIncognito } from "detectincognitojs";
	import FAQ from "$components/FAQ.svelte";
	import Draw from "$components/Draw.svelte";
	import Join from "$components/Join.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import storage from "$utils/localStorage.js";
	import getParam from "$utils/getParam.js";
	import generateId from "$utils/generateId.js";
	import { userData, showFaq, showJoin, noCredit } from "$stores/misc.js";

	const copy = getContext("copy");

	let prevShortcode;
	let animationId;
	let prevFrameIndex;
	let frameCount = 0;
	let submitted;
	let exhausted;
	let reversed;
	let availableCount = 1;

	async function loadStorage() {
		const { isPrivate } = await detectIncognito();
		const reset = getParam("reset");
		if (dev && reset) storage.set("pudding_flipbook_data", {});
		$userData = storage.get("pudding_flipbook_data") || {};

		if (!$userData?.id) {
			$userData = {
				id: generateId(),
				neato: isPrivate,
				submissions: []
			};
		}

		if (dev) console.log({ $userData });
	}

	async function loadData() {
		submitted = false;
		const url = "https://pudding.cool/projects/flipbook-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		const data = await response.json();

		availableCount = data.animations.length;

		const withUser = data.animations.map((a) => {
			const o = { ...a };
			const match = $userData.submissions.find((s) => s.animationId === a.id);
			o.available = !match;
			return o;
		});

		if (dev) console.log({ withUser });

		const available = withUser.filter((a) => a.available);

		exhausted = available.length === 0;
		exhausted = true;
		if (!exhausted) {
			const r = Math.floor(Math.random() * available.length);
			const chosen = available[r];

			prevShortcode = chosen.shortcode;
			animationId = chosen.id;
			prevFrameIndex = chosen.frame_index;
		}

		frameCount = format(",")(data.frames || 0);
		console.log("updated:", new Date(data.updated).toLocaleString());
	}

	function onDone() {
		const el = document.querySelector("#draw");
		if (el)
			setTimeout(() => {
				window.scrollTo(0, el.offsetTop + 36);
			}, 17);

		submitted = true;
		prevShortcode = null;
		animationId = null;
		prevFrameIndex = null;
	}

	function onSignup() {
		$showJoin = true;
	}

	async function onOther() {
		await loadData();
	}

	$: if ($userData) storage.set("pudding_flipbook_data", $userData);

	$: if ((browser && $showFaq) || $showJoin) {
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.width = "100%";
	} else if (browser) {
		document.body.style.overflow = "auto";
		document.body.style.position = "static";
		document.body.style.width = "auto";
	}
	onMount(async () => {
		reversed = Math.random() < 0.5;
		await loadStorage();
		await loadData();
	});
</script>

<section id="intro">
	<p>
		<small
			><a href="https://pudding.cool" target="_blank" rel="noreferer"
				>The Pudding</a
			> presents</small
		>
	</p>

	<h1>
		{@html copy.hed}
	</h1>

	<p class="warning">
		<details>
			<summary
				><small>Warning: {@html copy.draw.warningSummary} </small>
			</summary>
			<div>
				<p><small>{@html copy.draw.warningDetails}</small></p>
			</div>
		</details>
	</p>

	{#if !submitted}
		<p>
			{@html copy.sub}
		</p>
		<p class="stats" class:visible={!!frameCount}>
			<strong>{frameCount} frames</strong>
			{copy.statsFrames}
		</p>
	{/if}
</section>

<section class="hr"></section>
<div id="draw"></div>

{#if prevShortcode}
	<Draw {animationId} {prevShortcode} {prevFrameIndex} on:done={onDone}></Draw>
{:else if exhausted}
	<section>
		<!-- <p>{@html copy.exhausted}</p> -->
		<p>Submissions are closed! Please check back soon for the results.</p>
		{#if !$userData?.human}
			{#if $noCredit}
				<p>{@html copy.signupNoCredit}</p>
				<p><button on:click={onSignup}>Notify me</button></p>
			{:else}
				<!-- <p>{@html copy.signup}</p> -->
				<p>Get notified when the flipbook animation is ready to view.</p>
				<p><button on:click={onSignup}>Add me</button></p>
			{/if}
		{/if}
	</section>
{:else if submitted}
	<section class="submitted">
		<p><strong>{@html copy.submitted}</strong></p>
		{#if !$userData?.human}
			{#if $noCredit}
				<p>{@html copy.signupNoCredit}</p>
				<p><button on:click={onSignup}>Notify me</button></p>
			{:else}
				<p>{@html copy.signup}</p>
				<p><button on:click={onSignup}>Add me</button></p>
			{/if}
		{/if}
		{#if !exhausted && availableCount > 1}
			<p>{@html copy.other}</p>
			<p><button on:click={onOther}>Draw more</button></p>
		{/if}
		<p>{@html copy.share}</p>
		<p>
			<ShareButton buttonText={copy.spread} title={copy.title} url={copy.url} />
		</p>
	</section>
{:else}
	<div class="loading"></div>
{/if}

{#if $showJoin}
	<Join {reversed} noCredit={$noCredit} on:close={() => ($showJoin = false)}
	></Join>
{/if}

<section class="hr"></section>

<footer>
	<section>
		<FAQ />
		{#if !submitted}
			<p>
				<ShareButton
					buttonText={copy.spread}
					title={copy.title}
					url={copy.url}
				/>
			</p>
		{/if}

		<p>{@html copy.recirc}</p>
	</section>
</footer>

<style>
	#intro p {
		margin: 32px auto;
	}

	p.stats {
		visibility: hidden;
	}

	p.stats.visible {
		visibility: visible;
	}

	#intro p.warning {
		margin-top: 8px;
	}

	summary {
		cursor: pointer;
	}

	#intro details p {
		margin: 0;
	}

	.loading {
		height: 500px;
	}

	.submitted {
		margin-top: 32px;
	}

	footer {
		margin: 32px auto;
	}
</style>
