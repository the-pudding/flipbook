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

	let previousShortcode;
	let animationId;
	let animationFrameIndex;
	let frameCount = 0;

	function loadStorage() {
		$userData = storage.get("pudding_flipbook_data") || {};

		if (!$userData?.id) {
			$userData = {
				id: generateId(),
				submissions: []
			};

			storage.set("pudding_flipbook_data", $userData);
		}

		console.log($userData);
	}

	async function loadData() {
		const url = "https://pudding.cool/projects/flipbook-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		const data = await response.json();
		console.log(data);

		// TODO
		previousShortcode = data.animations[0].prev;
		animationId = data.animations[0].id;
		animationFrameIndex = data.animations[0].index;

		frameCount = format(",")(data.frames || 0);
		console.log("updated", data.updated);
	}

	onMount(async () => {
		loadStorage();
		await loadData();
	});
</script>

<section id="intro">
	<h1>
		{@html copy.cta}
	</h1>

	<p>
		{@html copy.definition}
		<br />
		<span class="stats" class:visible={!!frameCount}>
			<strong>{frameCount}</strong>
			{copy.statsFrames}
		</span>
	</p>
</section>

{#if previousShortcode}
	<Draw {animationId} {previousShortcode} {animationFrameIndex}></Draw>
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
