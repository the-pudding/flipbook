<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import version from "$utils/version.js";
	import { createClient } from "@supabase/supabase-js";
	export let data;

	version();

	const supabase = createClient(data.supabaseUrl, data.supabaseKey);

	let animations = []; // = [{ id, frame_idex, expiration, shortcode }]
	let waiting = 0;
	let skipped = 0;
	let contributed = 0;

	async function updateAnimations() {
		for (let animation of animations) {
			if (animation.updatePerson) {
				if (animation.pool_id) {
					const { email, phone, notified } = await getPerson(animation.pool_id);
					animation.email = email;
					animation.phone = phone;
					animation.notified = notified;
				}

				animation.updatePerson = false;

				// next 10
				const next = await getNext();
				animation.next = next;
			}

			if (animation.updateDrawing) {
				const { drawing } = await getDrawing(
					animation.id,
					animation.frame_index
				);
				animation.drawing = drawing;
				animation.updateDrawing = false;
			}

			animation.time = animation.expiration
				? new Date(animation.expiration).toLocaleTimeString()
				: null;
		}

		animations = animations;

		setTimeout(() => {
			animations.forEach((a) => (a.updated = false));
			animations = animations;
		}, 1000);
	}

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
							updated: true,
							updatePerson: payload.old?.pool_id,
							updateDrawing: payload.old?.frame_index
						};
					updateAnimations();
				}
			}
		)
		.subscribe();

	async function getPerson(id) {
		const response = await supabase.from("pool").select().eq("id", id);

		if (response.error) {
			console.log(response.error);
			throw new Error("getPerson failed");
		} else if (response.data) return response.data[0];
		return undefined;
	}

	async function getNext() {
		const response = await supabase
			.from("pool")
			.select("email, phone, timezone, notified")
			.in("notified", ["next", "soon"]);

		if (response.error) {
			console.log(response.error);
			throw new Error("getNext failed");
		} else if (response.data) return response.data;
		return undefined;
	}

	async function getWaiting() {
		const response = await supabase
			.from("pool")
			.select("*", { count: "exact", head: true })
			.eq("ready", true);

		if (response.error) {
			console.log(response.error);
			throw new Error("getWaiting failed");
		} else if (response) return response.count;
		return undefined;
	}

	async function getSkipped() {
		const response = await supabase
			.from("pool")
			.select("*", { count: "exact", head: true })
			.eq("notified", "skipped");

		if (response.error) {
			console.log(response.error);
			throw new Error("getSkipped failed");
		} else if (response) return response.count;
		return undefined;
	}

	async function getContributed() {
		const response = await supabase
			.from("pool")
			.select("*", { count: "exact", head: true })
			.gte("contributions", 1);

		if (response.error) {
			console.log(response.error);
			throw new Error("getContributed failed");
		} else if (response) return response.count;
		return undefined;
	}

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

	async function onReset(id) {
		const response = await supabase
			.from("animation")
			.update({
				drawing: null,
				pool_id: null,
				expiration: null,
				shortcode: null
			})
			.eq("id", id);

		if (response.error) {
			console.log(response.error);
			throw new Error("onReset failed");
		} else if (response) return;
		return undefined;
	}

	onMount(async () => {
		animations = await getAllAnimations();
		animations.forEach((a) => {
			a.next = [];
			a.updatePerson = true;
			a.updateDrawing = true;
		});
		await updateAnimations();

		waiting = await getWaiting();
		skipped = await getSkipped();
		contributed = await getContributed();
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
				<th>Expires</th>
				<th>Shortcode</th>
				<th>Email</th>
				<th>Phone</th>
				<th>Notified</th>
				<th>Pause</th>
				<th>Reset</th>
			</tr>
		</thead>
		<tbody>
			{#each animations as a}
				{@const updated = a.updated}
				<tr class:updated>
					<td>{a.id}</td>
					<td>{a.frame_index}</td>
					<td>{a.time}</td>
					<td>{a.shortcode}</td>
					<td>{a.email}</td>
					<td>{a.phone}</td>
					<td>{a.notified}</td>
					<td
						><button on:click={() => onPause(a.id, !a.paused)}
							>{a.paused ? "Resume" : "Pause"}</button
						></td
					>
					<td><button on:click={() => onReset(a.id)}>Reset</button></td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h2>Previous</h2>
	{#each animations as animation}
		<p>
			<mark>animation: {animation.id} frame: {animation.frame_index - 1}</mark>
		</p>
		<svg>
			<path d={animation.drawing} />
		</svg>
	{/each}

	<h2>Pool</h2>
	<p>waiting: {waiting}</p>
	<p>skipped: {skipped}</p>
	<p>contributed: {contributed}</p>

	{#each animations as animation}
		<p><mark>animation: {animation.id}</mark></p>
		<table>
			<thead>
				<tr>
					<th>Email</th>
					<th>Phone</th>
					<th>Timezone</th>
					<th>Notified</th>
				</tr>
			</thead>
			{#each animation.next as person}
				<tbody>
					<tr>
						<td>{person.email}</td>
						<td>{person.phone}</td>
						<td>{person.timezone}</td>
						<td>{person.notified}</td>
					</tr>
				</tbody>
			{/each}
		</table>
	{/each}
</section>

<style>
	section {
		padding: 0 16px;
	}

	.updated {
		transition: background 0.5s;
		background: greenyellow;
	}

	th,
	td {
		padding: 8px;
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
