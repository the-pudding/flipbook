<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	// import dtwDistance from "$utils/dtwDistance.js";
	// import resampleLine from "$utils/resampleLine.js";
	// import getPointDistance from "$utils/getPointDistance.js";
	import validateLine from "$utils/validateLine.js";

	const W = 300;
	const H = W;
	const FPS = 12;
	const preset = [
		[
			[50, 150],
			[250, 150]
		],
		[
			[50, 225],
			[150, 75],
			[250, 225],
			[50, 225]
		],
		[
			[50, 50],
			[250, 50],
			[250, 250],
			[50, 250],
			[50, 50]
		]
	];

	let drawing = false;
	let attempt = 1;
	let coordinates = [];
	let pathSubmit = "";
	let pathAnimate = "";
	let v = "";
	let valid;
	let debug1 = {};
	let debug2 = {};

	let pathDebug = "";

	function normalizeFrechet(frechet) {
		return frechet / DIAGONAL;
	}

	function flattenArray(arr) {
		let flat = [];
		for (let segment of arr) {
			flat.push(...segment);
		}
		return flat;
	}

	function point(e) {
		const x = +e.offsetX.toFixed(1);
		const y = +e.offsetY.toFixed(1);
		// const x = Math.round(e.offsetX);
		// const y = Math.round(e.offsetY);
		return [x, y];
	}

	function startDrawing(e) {
		drawing = true;
		const d = point(e);

		coordinates[attempt] = [];
		coordinates[attempt].push(d);

		// if (!coordinates[attempt]) coordinates[attempt] = [];
		// coordinates[attempt].push([d]);
	}

	function drawLine(e) {
		if (!drawing) return;
		const d = point(e);

		coordinates[attempt].push(d);
		// coordinates[attempt][coordinates[attempt].length - 1].push(d);

		coordinates = [...coordinates];
	}

	function stopDrawing() {
		drawing = false;
	}

	function animate(prev = 0) {
		v = prev + 1;
		if (v > attempt - 1) v = 0;
		if (!coordinates[v]?.length) setTimeout(animate, 1000);
		else {
			const c = coordinates[v].map((d) => d.join(" ")).join(" L ");
			pathAnimate = `M ${c}`;
			setTimeout(() => {
				animate(v);
			}, 1000 / FPS);
		}
	}

	// function animate(prev = 0) {
	// 	v = prev + 1;
	// 	if (v > attempt - 1) v = 0;
	// 	if (!coordinates[v]?.length) setTimeout(animate, 1000);
	// 	else {
	// 		const c = coordinates[v]
	// 			.map((strokes) => strokes.map((s) => s.join(" ")).join(" L "))
	// 			.join(" M ");
	// 		pathAnimate = `M ${c}`;
	// 		setTimeout(() => {
	// 			animate(v);
	// 		}, 1000 / FPS);
	// 	}
	// }

	function submit() {
		if (attempt > 0) {
			const cur = [...coordinates[attempt]].map(([x, y]) => ({ x, y }));
			const prev = [...coordinates[attempt - 1]].map(([x, y]) => ({
				x,
				y
			}));
			const diagonal = Math.sqrt(W ** 2 + H ** 2);

			const response = validateLine({ cur, prev, diagonal });
			valid = response.valid;
			debug1 = response.debug1;
			debug2 = response.debug2;

			if (valid) {
				pathSubmit = pathCurrent;
				attempt += 1;
			} else {
				setTimeout(() => {
					valid = undefined;
				}, 2000);
			}
			coordsCurrent = [];
		}
	}

	function reset() {
		coordinates[attempt] = [];
	}

	// $: coordsCurrent = coordinates[attempt]
	// 	?.map((stroke) => stroke.map((s) => s.join(" ")).join(" L "))
	// 	.join(" M ");
	// $: pathCurrent = coordsCurrent?.length ? `M ${coordsCurrent}` : "";

	$: coordsCurrent = coordinates[attempt]?.map((d) => d.join(" ")).join(" L ");
	$: pathCurrent = coordsCurrent?.length ? `M ${coordsCurrent}` : "";

	onMount(() => {
		const r = Math.floor(Math.random() * preset.length);
		coordinates = [preset[2]];
		pathSubmit = `M ${coordinates[0].map((d) => d.join(" ")).join(" L ")}`;
		animate();
	});
</script>

<div
	class="c"
	on:pointerdown={startDrawing}
	on:pointermove={drawLine}
	on:pointerup={stopDrawing}
	on:pointerleave={stopDrawing}
	class:first={attempt === 0}
>
	<svg class="shadow">
		<g>
			{#if pathSubmit}
				<path class="prev" d={pathSubmit} />
			{/if}
			<path d={pathCurrent} />
		</g>
	</svg>
	<p>{attempt}</p>
	{#if valid === false}
		<p transition:fade class="invalid">I think you can do better!</p>
	{/if}
</div>

<div class="c ui">
	<button on:click={submit}>submit</button><button on:click={reset}
		>reset</button
	>
</div>

<div class="debug">
	<p style="text-align: center; font-family: var(--mono); font-size: 12px;">
		target: ll &lt; ~0.1 && sim &gt; 0.9 &amp;&amp; (diag &lt; 0.2 || len &lt;
		0.2)
	</p>
	<p style="text-align: center; font-family: var(--mono); font-size: 12px;">
		debug1: {JSON.stringify(debug1)}
	</p>
	<p style="text-align: center; font-family: var(--mono); font-size: 12px;">
		debug2: {JSON.stringify(debug2)}
	</p>
</div>

<div class="c">
	<svg class="shadow">
		<g>
			<path d={pathAnimate} />
		</g>
	</svg>
	<p>{v}</p>
</div>

<style>
	.ui button {
		margin: 0 8px;
	}

	.c {
		position: relative;
		width: 300px;
		height: 300px;
		margin: 16px auto;
		touch-action: none;
		user-select: none;
	}

	.ui {
		display: flex;
		justify-content: center;
		max-width: 300px;
		height: auto;
		margin: 0 auto;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		cursor: crosshair;
	}

	svg path {
		fill: none;
		stroke: #000;
		stroke-width: 4px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	path.prev {
		stroke-opacity: 0.5;
		stroke: red;
	}

	.c p {
		text-align: right;
		position: absolute;
		top: 4px;
		right: 4px;
		margin: 0 0;
		line-height: 1;
		font-family: var(--mono);
		pointer-events: none;
		opacity: 0.5;
		font-size: 12px;
	}

	p.invalid {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0;
		padding: 8px;
		z-index: 1;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
	}
</style>
