<script>
	import { writable } from "svelte/store";
	import { browser } from "$app/environment";
	// import previous from "$stores/previous.js";

	let drawing = false;
	let attempt = 0;
	let coordinates = [];
	let pathAnimate = "";
	let pathSubmit = "";
	let v = "";

	// const pathSubmit = writable("");
	// const pathPrevious = previous(pathSubmit);

	function point(e) {
		// const x = Math.round(e.offsetX);
		// const y = Math.round(e.offsetY);
		const x = e.offsetX.toFixed(1);
		const y = e.offsetY.toFixed(1);
		return [x, y];
	}

	function startDrawing(e) {
		drawing = true;
		coordinates.push([]);
		const d = point(e);
		coordinates[attempt].push(d);
	}

	function drawLine(e) {
		if (!drawing) return;
		const d = point(e);
		coordinates[attempt].push(d);
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
			let p = "M ";
			const c = coordinates[v].map((d) => d.join(" ")).join(" L ");
			pathAnimate = `${p}${c}`;
			setTimeout(() => {
				animate(v);
			}, 1000 / 12);
		}
	}

	function submit() {
		pathSubmit = pathCurrent;
		coordsCurrent = [];
		attempt += 1;
	}

	$: coordsCurrent = coordinates[attempt]?.map((d) => d.join(" ")).join(" L ");
	$: pathCurrent = coordsCurrent?.length ? `M ${coordsCurrent}` : "";
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

<p><button on:click={submit}>submit</button></p>

<div>
	<svg>
		<g>
			<path d={pathAnimate} />
		</g>
	</svg>
	<p>{v}</p>
</div>

<style>
	p {
		text-align: center;
	}

	div {
		position: relative;
		width: 300px;
		height: 300px;
		margin: 16px auto;
		touch-action: none;
	}

	div.first:first-of-type:after {
		position: absolute;
		content: "trace red the line";
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
