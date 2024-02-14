<script>
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import lineLength from "$utils/lineLength.js";
	import validateLine from "$utils/validateLine.js";
	// import presets from "$data/presets.json";

	export let preset;
	export let debug;
	export let path;
	export let paths;
	export let disabled;

	const W = 300;
	const H = W;
	const MAX_LINE_LENGTH = W * 5;
	const FPS = 12;
	const MAX_FRAMES = FPS * 5;
	const dispatch = createEventDispatcher();

	const shouldValidate = !!preset;

	let inkRem = 1;
	let noInk = false;
	let drawing = false;
	let frameIndex = 0;
	let coordinates = [];
	let pathPrevious = "";
	let pathPreview = "";
	let valid;
	let debug1 = {};
	let debug2 = {};
	let previewing;

	let pathDebug = "";

	export const preview = togglePreview;
	export const addFrame = add;
	export const deleteFrame = del;
	export const resetFrame = reset;

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
		return [x, y];
	}

	function startDrawing(e) {
		noInk = false;
		inkRem = 1;
		drawing = true;
		const d = point(e);

		coordinates[frameIndex] = [];
		coordinates[frameIndex].push(d);
	}

	function drawLine(e) {
		if (!drawing || noInk) return;
		const d = point(e);

		coordinates[frameIndex].push(d);
		const len = lineLength(coordinates[frameIndex]);
		if (len > MAX_LINE_LENGTH) {
			noInk = true;
		}
		inkRem = Math.max(0, (MAX_LINE_LENGTH - len) / MAX_LINE_LENGTH);
		coordinates = [...coordinates];
	}

	function stopDrawing() {
		drawing = false;
	}

	function submit() {
		if (shouldValidate && frameIndex > 0) {
			const cur = [...coordinates[frameIndex]].map(([x, y]) => ({ x, y }));
			const prev = [...coordinates[frameIndex - 1]].map(([x, y]) => ({
				x,
				y
			}));
			const diagonal = Math.sqrt(W ** 2 + H ** 2);

			const response = validateLine({ cur, prev, diagonal });

			valid = response.valid;
			debug1 = response.debug1;
			debug2 = response.debug2;

			dispatch("validate", valid);
		} else valid = true;

		if (valid) {
			pathPrevious = pathCurrent;
			frameIndex += 1;
		} else {
			setTimeout(() => {
				valid = undefined;
			}, 2000);
		}

		coordsCurrent = [];
		inkRem = 1;
	}

	function reset() {
		coordinates[frameIndex] = [];
		pathPreview = "";
		inkRem = 1;
	}

	function animatePreview(index = 0) {
		const str = coordinates[index].map((d) => d.join(" ")).join("L");
		pathPreview = previewing ? `M${str}` : "";
		setTimeout(() => {
			let next = index + 1;
			if (next > frameIndex - 1) next = 0;
			if (previewing) animatePreview(next);
		}, 1000 / FPS);
	}

	function add() {
		submit();
	}

	function del() {
		// TODO
	}

	function togglePreview() {
		previewing = !previewing;
		if (previewing) animatePreview();
		else pathPreview = "";
	}

	onMount(() => {
		pathPrevious = preset || "";
		if (pathPrevious) {
			frameIndex = 1;
			coordinates[0] = flattenArray(
				pathPrevious
					.split("M")
					.filter((d) => d)
					.map((d) => d.split("L").map((d) => d.split(" ").map((d) => +d)))
			);
		}
	});

	$: coordsCurrent = coordinates[frameIndex]?.map((d) => d.join(" ")).join("L");
	$: pathCurrent = coordsCurrent?.length ? `M${coordsCurrent}` : "";
	$: paths = coordinates.map((c) => `M${c.map((d) => d.join(" ")).join("L")}`);
	$: path = pathCurrent;
</script>

<div
	class="c"
	on:pointerdown={startDrawing}
	on:pointermove={drawLine}
	on:pointerup={stopDrawing}
	on:pointerleave={stopDrawing}
	class:disabled
>
	<div class="canvas">
		<svg class="preview">
			<g>
				<path d={pathPreview} />
			</g>
		</svg>

		<svg class="draw shadow">
			<g>
				{#if pathPrevious && !previewing}
					<path class="prev" d={pathPrevious} />
				{/if}
				<path d={pathCurrent} />
			</g>
		</svg>

		<p>{frameIndex}</p>
		{#if valid === false}
			<p transition:fade class="invalid">I think you can do better!</p>
		{/if}
	</div>
	<div class="ink">
		{#if noInk}
			<span class="message">no ink left!</span>
		{:else}
			<span class="bar" style="--ink: {inkRem * 100}%;" />
		{/if}
	</div>
</div>

<slot name="ui" />

{#if debug}
	<div class="debug">
		<p style="font-family: var(--mono); font-size: 12px;">
			target: ll &lt; ~0.1 && sim &gt; 0.9 &amp;&amp; (diag &lt; 0.2 || len &lt;
			0.2)
		</p>
		<p style="font-family: var(--mono); font-size: 12px;">
			debug1: {JSON.stringify(debug1)}
		</p>
		<p style="font-family: var(--mono); font-size: 12px;">
			debug2: {JSON.stringify(debug2)}
		</p>
	</div>
{/if}

<style>
	div {
		margin: 0;
	}

	.c {
		padding: 16px 0;
		width: var(--canvas-size);
	}

	.canvas {
		position: relative;
		height: var(--canvas-size);
		touch-action: none;
		user-select: none;
		background: var(--color-fg);
	}

	.c.disabled {
		pointer-events: none;
	}

	.c.disabled svg {
		cursor: not-allowed;
	}

	.ui {
		display: flex;
		justify-content: center;
		max-width: var(--canvas-size);
		width: 100%;
		height: auto;
		background: var(--color-bg);
		margin-top: 32px;
		padding: 8px 0;
	}

	.ui button {
		margin: 0 8px;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
		cursor: crosshair;
	}

	svg.preview {
		position: absolute;
		top: 0;
		left: 0;
	}

	svg path {
		fill: none;
		stroke: var(--color-bg);
		stroke-width: 4px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	path.prev {
		stroke-opacity: 0.33;
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
		top: 50%;
		width: 90%;
		left: 50%;
		transform: translate(-50%, -50%);
		right: 0;
		margin: 0;
		padding: 8px;
		z-index: 1;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
		background: var(--color-bg);
		color: var(--color-fg);
		opacity: 0.9;
	}

	.ink {
		background: var(--color-secondary);
		height: 12px;
		position: relative;
	}

	.ink .bar {
		display: block;
		background: var(--color-bg);
		height: 4px;
		transform: translate(4px, 4px);
		width: calc(var(--ink) - 8px);
	}

	.ink .message {
		position: absolute;
		bottom: 0;
		left: 0;
		transform: translateY(calc(100% + 8px));
		color: var(--color-secondary);
	}
</style>
