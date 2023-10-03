<script>
	import { browser } from "$app/environment";
	import dtw from "$utils/dtwDistance.js";

	const FPS = 12;

	let drawing = false;
	let attempt = 0;
	let coordinates = [];
	let pathAnimate = "";
	let pathSubmit = "";
	let v = "";

	function flattenArray(arr) {
		let flat = [];
		for (let segment of arr) {
			flat.push(...segment);
		}
		return flat;
	}

	function point(e) {
		const x = e.offsetX.toFixed(1);
		const y = e.offsetY.toFixed(1);
		return [x, y];
	}

	function startDrawing(e) {
		drawing = true;
		const d = point(e);
		// coordinates[attempt] = [];
		// coordinates[attempt].push(d);

		if (!coordinates[attempt]) coordinates[attempt] = [];
		coordinates[attempt].push([d]);
	}

	function drawLine(e) {
		if (!drawing) return;
		const d = point(e);
		// coordinates[attempt].push(d);
		coordinates[attempt][coordinates[attempt].length - 1].push(d);
		coordinates = [...coordinates];
	}

	function stopDrawing() {
		drawing = false;
	}

	// function animate(prev = 0) {
	// 	v = prev + 1;
	// 	if (v > attempt - 1) v = 0;
	// 	if (!coordinates[v]?.length) setTimeout(animate, 1000);
	// 	else {
	// 		const c = coordinates[v].map((d) => d.join(" ")).join(" L ");
	// 		pathAnimate = `M ${c}`;
	// 		setTimeout(() => {
	// 			animate(v);
	// 		}, 1000 / FPS);
	// 	}
	// }

	function animate(prev = 0) {
		v = prev + 1;
		if (v > attempt - 1) v = 0;
		if (!coordinates[v]?.length) setTimeout(animate, 1000);
		else {
			const c = coordinates[v]
				.map((strokes) => strokes.map((s) => s.join(" ")).join(" L "))
				.join(" M ");
			pathAnimate = `M ${c}`;
			setTimeout(() => {
				animate(v);
			}, 1000 / FPS);
		}
	}

	function submit() {
		pathSubmit = pathCurrent;
		coordsCurrent = [];
		attempt += 1;
	}

	function reset() {
		coordinates[attempt] = [];
	}

	$: coordsCurrent = coordinates[attempt]
		?.map((stroke) => stroke.map((s) => s.join(" ")).join(" L "))
		.join(" M ");

	$: pathCurrent = coordsCurrent?.length ? `M ${coordsCurrent}` : "";

	// $: coordsCurrent = coordinates[attempt]?.map((d) => d.join(" ")).join(" L ");
	// $: pathCurrent = coordsCurrent?.length ? `M ${coordsCurrent}` : "";
	$: if (browser) animate();
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
</div>

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
	}

	div.first:first-of-type:after {
		position: absolute;
		content: "trace the red line";
		font-size: 12px;
		text-align: center;
		line-height: 2;
		display: block;
		width: calc(100% - 40px);
		left: 20px;
		top: 50%;
		transform: translateY(-1px);
		height: 2px;
		background: red;
		opacity: 0.5;
		pointer-events: none;
		font-family: var(--mono);
	}

	svg {
		display: block;
		background: #efefef;
		width: 100%;
		height: 100%;
	}

	svg path {
		fill: none;
		stroke: #000;
		stroke-width: 2px;
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
</style>
