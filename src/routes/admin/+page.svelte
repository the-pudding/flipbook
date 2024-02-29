<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import version from "$utils/version.js";
	import { createClient } from "@supabase/supabase-js";
	export let data;

	version();

	const supabase = createClient(data.supabaseUrl, data.supabaseKey);

	let animations = [];
	let waiting = 0;
	let skipped = 0;
	let contributed = 0;

	const channels = supabase
		.channel("custom-all-channel")
		.on(
			"postgres_changes",
			{ event: "*", schema: "public", table: "animation" },
			async (payload) => {
				if (animations.length && payload.new) {
					const i = animations.findIndex((d) => d.id === payload.new.id);

					if (i > -1)
						animations[i] = {
							...animations[i],
							...payload.new,
							updated: true
						};

					animations = animations;
					setTimeout(() => {
						animations[i].updated = false;
						animations = animations;
					}, 2000);
				}
			}
		)
		.subscribe();

	async function getDrawing(id, frame) {
		const response = await supabase
			.from("frame")
			.select()
			.eq("animation_id", id)
			.eq("index", frame);

		if (response.error) {
			console.log(response.error);
			throw new Error("getDrawing failed");
		} else if (response.data) return response.data[0];
		return undefined;
	}

	async function getAllAnimations() {
		const response = await supabase.from("animation").select();

		if (response.error) {
			console.log(response.error);
			throw new Error("getAllAnimations failed");
		} else if (response.data) return response.data;
		throw new Error("no animations");
	}

	async function onPause(id, paused) {
		const response = await supabase
			.from("animation")
			.update({ paused })
			.eq("id", id);

		if (response.error) {
			console.log(response.error);
			throw new Error("onPause failed");
		} else if (response) return;
		return undefined;
	}

	onMount(async () => {
		animations = await getAllAnimations();
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
			<!-- TODO -->
			<path />
		</svg>
	{/each}
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
