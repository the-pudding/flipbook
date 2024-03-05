<script>
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import lineLength from "$utils/lineLength.js";
	import validateLine from "$utils/validateLine.js";

	export let preset;
	export let path;
	export let paths;
	export let disabled;
	export let showFrameIndex;
	export let inkRem = 1;

	const W = 320;
	const H = W;
	const MAX_LINE_LENGTH = W * 5;
	const FPS = 12;
	const MAX_FRAMES = FPS * 5;
	const dispatch = createEventDispatcher();

	const shouldValidate = !!preset;

	let noInk = false;
	let drawing = false;
	let frameIndex = 0;
	let coordinates = [];
	let pathPrevious = "";
	let pathPreview = "";
	let valid = true;
	let debug1 = {};
	let debug2 = {};
	let previewing;

	let pathDebug = "";

	export const preview = togglePreview;
	export const addFrame = add;
	export const clearFrame = clear;
	export const resetFrame = reset;
	export const addMessage = message;

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
		message = null;
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
		valid = true;
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

	function clear() {
		reset();
	}

	function message(msg) {
		message = msg;
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
	$: message =
		valid === false
			? "I think you can do better!"
			: noInk
			  ? "Out of ink"
			  : null;
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

		{#if showFrameIndex}
			<p class="frame">{frameIndex + 1}</p>
		{/if}

		{#if message}
			<p in:fade class="message"><small>{message}</small></p>
		{/if}
	</div>
</div>

<slot name="ui" />

<!-- 
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
{/if} -->

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
		background-image: repeating-linear-gradient(
				0deg,
				var(--color-fg),
				var(--color-fg) 6px,
				transparent 6px,
				transparent 12px,
				var(--color-fg) 12px
			),
			repeating-linear-gradient(
				90deg,
				var(--color-fg),
				var(--color-fg) 6px,
				transparent 6px,
				transparent 12px,
				var(--color-fg) 12px
			),
			repeating-linear-gradient(
				180deg,
				var(--color-fg),
				var(--color-fg) 6px,
				transparent 6px,
				transparent 12px,
				var(--color-fg) 12px
			),
			repeating-linear-gradient(
				270deg,
				var(--color-fg),
				var(--color-fg) 6px,
				transparent 6px,
				transparent 12px,
				var(--color-fg) 12px
			);
		background-size:
			2px 100%,
			100% 2px,
			2px 100%,
			100% 2px;
		background-position:
			0 0,
			0 0,
			100% 0,
			0 100%;
		background-repeat: no-repeat;
	}

	.c.disabled {
		pointer-events: none;
	}

	.c.disabled svg {
		cursor: not-allowed;
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
		stroke: var(--color-fg);
		stroke-width: 4px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	path.prev {
		stroke: var(--color-secondary-aa);
		/* stroke: #8f8f8f; */
	}

	p.message {
		position: absolute;
		top: 50%;
		width: 90%;
		left: 50%;
		transform: translate(-50%, -50%);
		right: 0;
		margin: 0;
		padding: 8px 0 4px 0;
		z-index: 1;
		text-align: center;
		font-weight: var(--fw-bold);
		background: var(--color-fg);
		color: var(--color-bg);
		opacity: 0.9;
		pointer-events: none;
		font-size: 1em;
	}

	p.frame {
		position: absolute;
		top: 8px;
		left: 8px;
		margin: 0;
		z-index: 1;
		text-align: center;
		font-weight: var(--fw-bold);
		color: var(--color-bg);
		opacity: 0.75;
		pointer-events: none;
		font-size: 16px;
	}
</style>
