import GIF from "gif.js";

const FPS = 12;
const delay = Math.floor(1000 / FPS);

async function drawPath(ctx, path) {
	const p = new Path2D(path);
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 4;
	ctx.lineCap = "round";
	ctx.stroke(p);
}

export default async function renderGif({ frames, width, height }) {
	const navigatorCores = navigator.hardwareConcurrency || 4;
	const workers = Math.max(2, navigatorCores / 2);

	console.log(width, height);
	const gif = new GIF({
		workers,
		workerScript: "assets/gif.worker.js",
		quality: 1,
		width,
		height
	});

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;

	for (const frame of frames) {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, width, height);

		await drawPath(ctx, frame);

		// ctx.fillStyle = "red";
		// ctx.fillRect(0, 0, width, height); // Fill the canvas with a red rectangle

		gif.addFrame(ctx, { copy: true, delay });
	}

	gif.on("finished", (blob) => {
		window.open(URL.createObjectURL(blob));
	});

	gif.on("error", () => {
		console.log(error);
	});

	gif.render();
}
