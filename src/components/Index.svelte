<script>
	import { onMount, getContext } from "svelte";
	import { format } from "d3";
	import Draw from "$components/Draw.svelte";
	import Join from "$components/Join.svelte";
	import ShareButton from "$components/helpers/ShareButton.svelte";
	import server from "$utils/server.js";
	import storage from "$utils/localStorage.js";
	import getParam from "$utils/getParam.js";
	import generateId from "$utils/generateId.js";
	import { userData } from "$stores/misc.js";

	const copy = getContext("copy");

	let prevShortcode;
	let animationId;
	let prevFrameIndex;
	let frameCount = 0;

	function loadStorage() {
		$userData = storage.get("pudding_flipbook_data") || {};

		if (!$userData?.id) {
			$userData = {
				id: generateId(),
				submissions: []
			};
		}
	}

	async function loadData() {
		const url = "https://pudding.cool/projects/flipbook-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		const data = await response.json();
		console.log({ data });

		// TODO
		prevShortcode = data.animations[0].shortcode;
		animationId = data.animations[0].id;
		prevFrameIndex = data.animations[0].frame_index;

		frameCount = format(",")(data.frames || 0);
		console.log("updated:", new Date(data.updated).toLocaleString());
	}

	$: if ($userData) console.log($userData);
	$: if ($userData) storage.set("pudding_flipbook_data", $userData);
	onMount(async () => {
		loadStorage();
		await loadData();
	});
</script>

<section id="intro">
	<h1>
		{@html copy.title}
	</h1>

	<p>
		{@html copy.sub}
		<span class="stats" class:visible={!!frameCount}>
			<strong>{frameCount}</strong>
			{copy.statsFrames}
		</span>
	</p>
</section>

{#if prevShortcode}
	<Draw {animationId} {prevShortcode} {prevFrameIndex}></Draw>
{:else}
	<div class="loading"></div>
{/if}

<footer>
	<section>
		<p>
			<ShareButton buttonText={copy.spread} title={copy.title} url={copy.url} />
		</p>
		<p>{@html copy.recirc}</p>
	</section>
</footer>

<style>
	#intro p {
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

	footer {
		margin: 64px auto;
	}
</style>
