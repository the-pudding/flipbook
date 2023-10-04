<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { shapeSimilarity, frechetDistance } from "curve-matcher";
	import dtwDistance from "$utils/dtwDistance.js";
	import lineLength from "$utils/lineLength.js";
	import resampleLine from "$utils/resampleLine.js";
	import getPointDistance from "$utils/getPointDistance.js";

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
	let failed;
	let debug = {};

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
			// const flatCur = flattenArray(coordinates[attempt]);
			// const flatPrev = flattenArray(coordinates[attempt - 1]);

			const flatCur = [...coordinates[attempt]];
			const flatPrev = [...coordinates[attempt - 1]];
			const flatPrevReverse = [...flatPrev].reverse();

			const numPoints = Math.max(flatPrev.length, flatCur.length);
			const linePrev =
				numPoints > flatPrev.length
					? resampleLine(flatPrev, numPoints)
					: flatPrev;

			const linePrevReverse =
				numPoints > flatPrev.length
					? resampleLine(flatPrevReverse, numPoints)
					: flatPrevReverse;

			const lineCur =
				numPoints > flatCur.length ? resampleLine(flatCur, numPoints) : flatCur;

			const d1 = dtwDistance(linePrev, lineCur);
			const d2 = dtwDistance(linePrevReverse, lineCur);
			const distance = Math.min(d1, d2);
			const len = lineLength(flatCur);

			// TODO this only works when they start/end near similar places
			const score = Math.round(distance / len);
			const score2 = `${Math.floor(Math.min(1, len / distance) * 100)}%`;

			// TODO this only works for line
			const pointDistance = getPointDistance(flatPrev, flatCur);

			const curvePrev = flatPrev.map(([x, y]) => ({ x, y }));
			const curveCur = flatCur.map(([x, y]) => ({ x, y }));
			const similarity = shapeSimilarity(curvePrev, curveCur);
			const frechet = frechetDistance(curvePrev, curveCur);

			failed = score > 5 || pointDistance > 30;
			debug = {
				score,
				length: +len.toFixed(1),
				similarity: +similarity.toFixed(3),
				frechet: +frechet.toFixed(1)
			};

			if (failed) {
				setTimeout(() => {
					failed = undefined;
				}, 2000);
			} else {
				pathSubmit = pathCurrent;
				attempt += 1;
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
		coordinates = [preset[0]];
		pathSubmit = `M ${coordinates[0].map((d) => d.join(" ")).join(" L ")}`;
		animate();
	});
</script>

<div
	on:pointerdown={startDrawing}
	on:pointermove={drawLine}
	on:pointerup={stopDrawing}
	on:pointerleave={stopDrawing}
	class:first={attempt === 0}
>
	<svg>
		<g>
			{#if pathSubmit}
				<path class="prev" d={pathSubmit} />
			{/if}
			<path d={pathCurrent} />
		</g>
	</svg>
	<p>{attempt}</p>
	{#if failed}
		<p transition:fade class="fail">I think you can do better!</p>
	{/if}
</div>

<p style="text-align: center; font-family: var(--mono); font-size: 12px;">
	debug: {JSON.stringify(debug)}
</p>
<div class="ui">
	<button on:click={submit}>submit</button><button on:click={reset}
		>reset</button
	>
</div>

<div>
	<svg>
		<g>
			<path d={pathAnimate} />
		</g>
	</svg>
	<p>{v}</p>
</div>

<style>
	.ui {
		display: flex;
		justify-content: center;
		max-width: 300px;
		height: auto;
		margin: 0 auto;
	}

	.ui button {
		margin: 0 8px;
	}

	div {
		font-family: var(--mono);
		position: relative;
		width: 300px;
		height: 300px;
		margin: 16px auto;
		touch-action: none;
		user-select: none;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
		box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
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

	div p {
		text-align: right;
		position: absolute;
		top: 4px;
		right: 4px;
		margin: 0 0;
		line-height: 1;
		font-family: var(--mono);
	}

	p.fail {
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
