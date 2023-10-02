<script>
	let canvas;
	let context;
	let canvas2;
	let context2;
	let drawing = false;
	let attempt = 0;
	let coordinates = [];

	const startDrawing = (e) => {
		clearCanvas();
		drawing = true;
		context.beginPath();
		coordinates.push([]);
		attempt = coordinates.length - 1;
		const d = [Math.round(e.offsetX), Math.round(e.offsetY)];
		coordinates[attempt].push(d);
		context.moveTo(d[0] * 2, d[1] * 2);
	};

	const drawLine = (e) => {
		if (!drawing) return;
		const d = [Math.round(e.offsetX), Math.round(e.offsetY)];
		coordinates[attempt].push(d);
		context.lineTo(d[0] * 2, d[1] * 2);
		context.stroke();
	};

	const stopDrawing = () => {
		drawing = false;
		context.closePath();
	};

	const clearCanvas = () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	const animate = (prev = 0) => {
		let v = prev + 1;
		if (v > attempt - 1) v = 0;
		if (!coordinates[v]?.length) setTimeout(animate, 1000);
		else {
			context2.clearRect(0, 0, canvas2.width, canvas2.height);
			context2.beginPath();
			context2.moveTo(coordinates[v][0][0] * 2, coordinates[v][0][1] * 2);
			for (let i = 1; i < coordinates[v].length; i++) {
				context2.lineTo(coordinates[v][i][0] * 2, coordinates[v][i][1] * 2);
			}
			context2.stroke();
			setTimeout(() => {
				animate(v);
			}, 1000 / 12);
		}
	};

	$: if (canvas) {
		context = canvas.getContext("2d");
		context.lineWidth = 1;

		context2 = canvas2.getContext("2d");
		context2.lineWidth = 1;
		animate();
	}
</script>

<div>
	<canvas
		bind:this={canvas}
		width="600"
		height="600"
		on:pointerdown={startDrawing}
		on:pointermove={drawLine}
		on:pointerup={stopDrawing}
		on:pointerleave={stopDrawing}
	/>
</div>

<canvas
	bind:this={canvas2}
	width="600"
	height="600"
	on:pointerdown={startDrawing}
	on:pointermove={drawLine}
	on:pointerup={stopDrawing}
	on:pointerleave={stopDrawing}
/>

<style>
	div {
		position: relative;
		width: 300px;
		margin: 0 auto;
	}

	div:after {
		position: absolute;
		content: "trace red the line";
		font-size: 12px;
		text-align: center;
		line-height: 2;
		display: block;
		width: calc(100% - 40px);
		left: 20px;
		top: 50%;
		height: 1px;
		background: red;
		opacity: 0.5;
		pointer-events: none;
	}

	canvas {
		display: block;
		background: #efefef;
		width: 300px;
		height: 300px;
		user-select: none;
		margin: 16px auto;
		position: relative;
	}
</style>
