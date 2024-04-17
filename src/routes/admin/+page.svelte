<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { createClient } from "@supabase/supabase-js";
	import { groups } from "d3";
	import dataS3 from "data-s3";
	import version from "$utils/version.js";
	import Canvas from "$components/Canvas.svelte";
	import Drawing from "$components/Drawing.svelte";
	export let data;

	version();

	const bucket = "pudding.cool";
	const region = "us-east-1";
	const base = "projects/flipbook-data";

	let supabase;
	let animations = [];
	let frames = [];
	let path;
	let created;

	let publicData;
	let updated;
	let secondsAgo;

	async function loadDrawing({ id, shortcode }) {
		const root = "https://pudding.cool/projects/flipbook-data/drawings";
		const url = `${root}/${id}/${shortcode}.txt?version=${Date.now()}`;
		const response = await fetch(url);
		const path = await response.text();
		return path;
	}

	async function getAllAnimations() {
		try {
			const response = await supabase.from("animation").select();
			if (response.error) {
				console.log(response.error);
				throw new Error("getAllAnimations failed");
			} else if (response.data) return response.data;
			throw new Error("no animations");
		} catch (err) {
			console.log(err);
		}
	}

	async function onPause(id, paused) {
		try {
			const response = await supabase
				.from("animation")
				.update({ paused })
				.eq("id", id);

			if (response.error) {
				console.log(response.error);
				throw new Error("onPause failed");
			} else if (response) return;
			return undefined;
		} catch (err) {
			console.log(err);
		}
	}

	async function getRecentFrames(count) {
		try {
			const response = await supabase
				.from("frame")
				.select()
				.order("frame_index", { ascending: false })
				.limit(count * animations.length);
			if (response.error) {
				console.log(response.error);
				throw new Error("getRecentFrames failed");
			} else if (response.data) {
				const grouped = groups(response.data, (d) => d.animation_id);
				grouped.sort((a, b) => a[0] - b[0]);
				frames = [...grouped];
			}
			throw new Error("no frames");
		} catch (err) {
			console.log(err);
		}
	}

	function tick() {
		if (!publicData) secondsAgo = "?";
		else
			secondsAgo = Math.floor(
				(Date.now() - new Date(publicData.updated)) / 1000
			);
	}

	async function update() {
		const url = "https://pudding.cool/projects/flipbook-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		publicData = await response.json();

		updated = new Date(publicData.updated).toLocaleString();
		setTimeout(update, 5000);
	}

	// onMount(async () => {
	// 	supabase = createClient(data.supabaseUrl, data.supabaseKey);
	// 	const { accessKeyId, secretAccessKey } = data;
	// 	await dataS3.init({ accessKeyId, secretAccessKey, region });

	// 	const channels = supabase
	// 		.channel("custom-all-channel")
	// 		.on(
	// 			"postgres_changes",
	// 			{ event: "*", schema: "public", table: "animation" },
	// 			async (payload) => {
	// 				if (animations.length && payload.new) {
	// 					const i = animations.findIndex((d) => d.id === payload.new.id);

	// 					if (i > -1) {
	// 						if (!animations[i]) animations[i] = {};

	// 						animations[i] = {
	// 							...animations[i],
	// 							...payload.new,
	// 							updated: true
	// 						};

	// 						const drawing = await loadDrawing(animations[i]);
	// 						animations[i].drawing = drawing;
	// 					}

	// 					animations = animations;
	// 					setTimeout(() => {
	// 						animations[i].updated = false;
	// 						animations = animations;
	// 					}, 2000);
	// 				}
	// 			}
	// 		)
	// 		.subscribe();

	// 	animations = await getAllAnimations();
	// 	animations.sort((a, b) => b.id - a.id);
	// 	for (const a of animations) {
	// 		const drawing = await loadDrawing(a);
	// 		a.drawing = drawing;
	// 	}

	// 	animations = animations;

	// 	update();

	// 	setInterval(tick, 1000);
	// });
</script>

<!-- 
<section>
	<h1>Admin Dashboard</h1>

	<p>last public update: {secondsAgo} seconds ago</p>
	<p><small>{updated}</small></p>
</section>

<section>
	<h2>Current</h2>
	<table id="animations">
		<thead>
			<tr>
				<th>ID</th>
				<th>Frame Index</th>
				<th>Shortcode</th>
				<th>User ID</th>
				<th>Pause</th>
			</tr>
		</thead>
		<tbody>
			{#each animations as a}
				{@const updated = a.updated}
				<tr class:updated>
					<td>{a.id}</td>
					<td>{a.frame_index}</td>
					<td>{a.shortcode}</td>
					<td>{a.user_id}</td>
					<td
						><button class="small" on:click={() => onPause(a.id, !a.paused)}
							>{a.paused ? "Resume" : "Pause"}</button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<section>
	<h2>Previous</h2>
	<div class="previous">
		{#each animations.filter((d) => !d.paused) as animation}
			<div class="animation">
				<p>
					<mark>animation: {animation.id} frame: {animation.frame_index}</mark>
				</p>
				<svg>
					<path d={animation.drawing} />
				</svg>
			</div>
		{/each}
	</div>
</section>

<section>
	<h2>Recent Frames</h2>
	<p>
		<button on:click={() => getRecentFrames(10)}>10</button>
		<button on:click={() => getRecentFrames(20)}>20</button>
		<button on:click={() => getRecentFrames(30)}>30</button>
		<button on:click={() => getRecentFrames(30)}>40</button>
	</p>

	<div class="frames">
		{#each frames as [animation, f]}
			<div class="animation">
				<p>
					<mark>animation: {animation}</mark>
				</p>
				<ul>
					{#each f as { shortcode, frame_index, animation_id }}
						<li>
							<Drawing {shortcode} {animation_id} {frame_index}></Drawing>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<section>
	<h2>Public Data</h2>
	<pre>
		<code>
{JSON.stringify(publicData, null, 2)}
	</code>
	</pre>
</section>

<section>
	<h2>New Animation</h2>
	{#if created}
		<p>Animation Created!</p>
	{:else}
		<Canvas bind:path></Canvas>
	{/if}
	<details>
		<summary>Path Code</summary>
		<code>
			{path}
		</code>
	</details>
</section> -->

<style>
	h1 {
		margin-top: 32px;
	}

	section {
		padding: 0 16px;
		max-width: 1600px;
		width: 90%;
		margin-bottom: 64px;
	}

	h2 {
		margin: 8px 0;
	}

	tr {
		transition: background 0.5s;
	}

	.updated {
		background: greenyellow;
	}

	th,
	td {
		padding: 8px;
	}

	td {
		vertical-align: middle;
		border-bottom: 1px dashed currentColor;
	}

	svg {
		display: block;
		width: 320px;
		height: 320px;
		background: #fff;
		border: 2px dashed var(--color-fg);
	}

	path {
		fill: none;
		stroke: black;
		stroke-width: 4px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	#animations th:nth-of-type(1),
	#animations td:nth-of-type(1) {
		width: 4em;
	}

	#animations th:nth-of-type(2),
	#animations td:nth-of-type(2) {
		width: 8em;
	}

	#animations th:nth-of-type(3),
	#animations td:nth-of-type(3) {
		width: 10em;
	}

	.previous {
		display: flex;
		flex-wrap: wrap;
	}
	.animation {
		margin-right: 16px;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		padding: 0;
	}

	li {
		list-style-type: none;
	}
</style>
