<script>
	import { onMount } from "svelte";
	import { copy } from "svelte-copy";
	import { fade } from "svelte/transition";
	import { createClient } from "@supabase/supabase-js";
	import dataS3 from "data-s3";
	import version from "$utils/version.js";
	import Canvas from "$components/Canvas.svelte";
	export let data;

	version();

	const bucket = "pudding.cool";
	const region = "us-east-1";
	const base = "projects/flipbook-data";

	let supabase;
	let animations = [];
	let path;
	let created;

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

	function onCopy() {
		alert("copied");
	}

	onMount(async () => {
		supabase = createClient(data.supabaseUrl, data.supabaseKey);
		const { accessKeyId, secretAccessKey } = data;
		await dataS3.init({ accessKeyId, secretAccessKey, region });

		const channels = supabase
			.channel("custom-all-channel")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "animation" },
				async (payload) => {
					if (animations.length && payload.new) {
						const i = animations.findIndex((d) => d.id === payload.new.id);

						if (i > -1) {
							if (!animations[i]) animations[i] = {};

							animations[i] = {
								...animations[i],
								...payload.new,
								updated: true
							};

							const drawing = await loadDrawing(animations[i]);
							animations[i].drawing = drawing;
						}

						animations = animations;
						setTimeout(() => {
							animations[i].updated = false;
							animations = animations;
						}, 2000);
					}
				}
			)
			.subscribe();

		animations = await getAllAnimations();
		for (const a of animations) {
			const drawing = await loadDrawing(a);
			a.drawing = drawing;
		}

		animations = animations;
	});
</script>

<section>
	<h1>Admin Dashboard</h1>

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

	<h2>Previous</h2>
	{#each animations as animation}
		<p>
			<mark>animation: {animation.id} frame: {animation.frame_index}</mark>
		</p>
		<svg>
			<path d={animation.drawing} />
		</svg>
	{/each}

	<h2>New Animation</h2>
	{#if created}
		<p>Animation Created!</p>
	{:else}
		<Canvas bind:path></Canvas>
		<p>
			<button use:copy={path || ""} on:svelte-copy={onCopy}>Copy SVG</button>
		</p>
	{/if}
</section>

<style>
	section {
		padding: 0 16px;
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
		width: 300px;
		height: 300px;
		background: #fff;
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
</style>
