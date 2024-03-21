<script>
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import lineLength from "$utils/lineLength.js";
	import validateLine from "$utils/validateLine.js";

	export let animationId;
	export let preset;
	export let path;
	export let disabled;
	export let inkRem = 1;

	const STROKE_W = 4;
	const W = 320;
	const H = W;
	const MAX_LINE_LENGTH = W * (animationId === 28 ? 3 : 5);
	const dispatch = createEventDispatcher();

	const shouldValidate = !!preset;

	let noInk = false;
	let drawing = false;
	let coordinates = [];
	let pathPrevious = "";
	let pathPreview = "";
	let valid = true;
	let attempts = 0;

	export const addFrame = add;
	export const clearFrame = clear;
	export const resetFrame = reset;
	export const addMessage = message;

	function arrToPath(arr) {
		if (!arr.length) return "";
		const str = coordinates.map((d) => d.join(" ")).join("L");
		return `M${str}`;
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
		const newPoint = point(e);

		coordinates = [newPoint];
	}

	function drawLine(e) {
		if (!drawing || noInk) return;
		const newPoint = point(e);

		coordinates = [...coordinates, newPoint];
		const len = lineLength(coordinates);
		if (len > MAX_LINE_LENGTH) noInk = true;
		inkRem = Math.max(0, (MAX_LINE_LENGTH - len) / MAX_LINE_LENGTH);
	}

	function stopDrawing() {
		drawing = false;
	}

	function submit() {
		if (!coordinates.length) {
			message = "Draw something first!";
			dispatch("validate", false);
			setTimeout(() => {
				message = null;
			}, 2000);
			return;
		}

		if (shouldValidate) {
			attempts += 1;
			valid = validateLine({
				cur: path,
				prev: pathPrevious,
				canvasSize: W,
				strokeWidth: STROKE_W,
				attempts
			});

			dispatch("validate", valid);
		} else valid = true;

		if (!valid) {
			setTimeout(() => {
				valid = undefined;
			}, 2000);
		}

		coordinates = [];
		inkRem = 1;
	}

	function reset() {
		coordinates = [];
		inkRem = 1;
		message = null;
		noInk = false;
		valid = true;
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

	onMount(() => {
		pathPrevious = preset || "";
	});

	$: path = arrToPath(coordinates);
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
	<div class="canvas" style="--stroke-width: {STROKE_W};">
		<svg
			class="draw shadow"
			aria-label="a drawing canvas to trace an image drawn by a previous user"
		>
			<g>
				{#if pathPrevious}
					<path class="prev" d={pathPrevious} />
				{/if}
				<path d={path} />
			</g>
		</svg>

		{#if message}
			<p in:fade class="message"><small>{message}</small></p>
		{/if}
	</div>
</div>

<slot name="ui" />

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

	svg path {
		fill: none;
		stroke: var(--color-fg);
		stroke-width: var(--stroke-width);
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
</style>
