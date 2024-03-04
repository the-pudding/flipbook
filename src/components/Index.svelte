<script>
	import { dev, browser } from "$app/environment";
	import { onMount, getContext } from "svelte";
	import { shuffle, format } from "d3";
	import FAQ from "$components/FAQ.svelte";
	import Draw from "$components/Draw.svelte";
	import Join from "$components/Join.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import server from "$utils/server.js";
	import storage from "$utils/localStorage.js";
	import getParam from "$utils/getParam.js";
	import generateId from "$utils/generateId.js";
	import { userData, showFaq, showJoin } from "$stores/misc.js";

	const copy = getContext("copy");

	const FRAME_WAIT_THRESHOLD = 100;
	const TIME_WAIT_THRESHOLD = 1440; // one day

	let prevShortcode;
	let animationId;
	let prevFrameIndex;
	let frameCount = 0;
	let submitted;
	let exhausted;
	let reversed;

	function loadStorage() {
		$userData = storage.get("pudding_flipbook_data") || {};

		if (!$userData?.id) {
			$userData = {
				id: generateId(),
				submissions: []
			};
		}
	}

	async function loadData(refresh) {
		submitted = false;
		const url = "https://pudding.cool/projects/flipbook-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		const data = await response.json();

		const withUser = data.animations.map((a) => {
			const o = { ...a };
			const match = $userData.submissions.find((s) => s.animationId === a.id);

			if (match) {
				o.frameDelta = a.frame_index - match.nextFrameIndex;
				o.timeDelta = Math.floor((Date.now() - match.timestamp) / (60 * 1000));
			}

			o.available = !match || o.timeDelta > FRAME_WAIT_THRESHOLD;
			o.priority = o.id <= data.realtime;
			return o;
		});

		withUser.sort((a, b) => {
			if (a.available === b.available) {
				if (a.timeDelta === undefined) return -1;
				else if (b.timeDelta === undefined) return 1;
				else if (a.timeDelta === b.timeDelta) return a.id - b.id;
				return b.timeDelta - a.timeDelta;
			}
			return a.available === true ? -1 : 1;
		});

		if (dev) console.log({ withUser });

		exhausted = withUser.every((a) => !a.available);

		// TODO test this
		if (!exhausted) {
			let chosen;
			const choices1 = withUser.filter(
				(a) => a.priority && a.available && a.timeDelta === undefined
			);
			const choices2 = withUser.filter(
				(a) => a.available && a.timeDelta === undefined
			);
			const choices3 = withUser.filter((a) => a.available);
			if (choices1.length) {
				shuffle(choices1);
				chosen = choices1[0];
			} else if (choices2.length) {
				shuffle(choices2);
				chosen = choices2[0];
			} else {
				chosen = choices3[0];
			}

			prevShortcode = chosen.shortcode;
			animationId = chosen.id;
			prevFrameIndex = chosen.frame_index;
		}

		frameCount = format(",")(data.frames || 0);
		console.log("updated:", new Date(data.updated).toLocaleString());
	}

	async function onDone() {
		window.scrollTo(0, 0);
		submitted = true;
		prevShortcode = null;
		animationId = null;
		prevFrameIndex = null;
	}

	function onSignup() {
		$showJoin = true;
	}

	async function onOther() {
		await loadData(true);
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
		loadStorage();
		await loadData();
	});
</script>

<section id="intro">
	<h1>
		{@html copy.title}
	</h1>

	{#if !submitted}
		<p>
			{@html copy.sub}
			<span class="stats" class:visible={!!frameCount}>
				<strong>{frameCount} frames</strong>
				{copy.statsFrames}
			</span>
		</p>
	{/if}
</section>

{#if prevShortcode}
	<Draw {animationId} {prevShortcode} {prevFrameIndex} on:done={onDone}></Draw>
{:else if exhausted}
	<section><p>{@html copy.exhausted}</p></section>
{:else if submitted}
	<section class="submitted">
		<p><strong>{@html copy.submitted}</strong></p>
		{#if !$userData?.human}
			<p>{@html copy.signup}</p>
			<p><button on:click={onSignup}>Add me</button></p>
		{/if}
		{#if !exhausted}
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
	<Join {reversed} on:close={() => ($showJoin = false)}></Join>
{/if}

<FAQ />
<footer>
	<section>
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
		margin-top: 64px;
		margin-bottom: 64px;
	}

	.stats {
		visibility: hidden;
	}

	.stats.visible {
		visibility: visible;
	}

	.loading {
		height: 500px;
	}

	.submitted {
		margin-top: 64px;
	}

	footer {
		margin: 64px auto;
	}
</style>
