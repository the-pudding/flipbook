import { dev } from "$app/environment";

function pointsToPath(points) {
	return (
		points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z"
	);
}

export default async function overlapPercent({
	prev,
	cur,
	strokeWidth = 1,
	canvasSize = 320,
	targetRatioOverlap = 0.5,
	targetRatioExcess = 0.5
}) {
	const prevPath = pointsToPath(prev);
	const curPath = pointsToPath(cur);

	// Create two canvas elements
	const canvasPrev = document.createElement("canvas");
	const canvasCur = document.createElement("canvas");
	const canvasPrevBig = document.createElement("canvas");
	const canvasCurBig = document.createElement("canvas");
	canvasPrev.width = canvasCur.width = canvasSize;
	canvasPrev.height = canvasCur.height = canvasSize;
	canvasPrevBig.width = canvasCurBig.width = canvasSize;
	canvasPrevBig.height = canvasCurBig.height = canvasSize;

	// Get contexts
	const ctxPrev = canvasPrev.getContext("2d");
	const ctxCur = canvasCur.getContext("2d");
	const ctxPrevBig = canvasPrevBig.getContext("2d");
	const ctxCurBig = canvasCurBig.getContext("2d");

	// Set stroke styles
	ctxPrev.strokeStyle = "lightgray";
	ctxCur.strokeStyle = "black";
	ctxPrevBig.strokeStyle = "lightgray";
	ctxCurBig.strokeStyle = "black";
	ctxPrev.lineWidth = strokeWidth;
	ctxCur.lineWidth = strokeWidth;
	ctxPrevBig.lineWidth = strokeWidth * 4;
	ctxCurBig.lineWidth = strokeWidth * 4;

	// Draw paths
	const pathPrev = new Path2D(prevPath);
	const pathCur = new Path2D(curPath);
	ctxPrev.stroke(pathPrev);
	ctxCur.stroke(pathCur);
	ctxPrevBig.stroke(pathPrev);
	ctxCurBig.stroke(pathCur);

	// Get image data
	const imgDataPrev = ctxPrev.getImageData(0, 0, canvasSize, canvasSize);
	const imgDataCur = ctxCur.getImageData(0, 0, canvasSize, canvasSize);
	const imgDataPrevBig = ctxPrevBig.getImageData(0, 0, canvasSize, canvasSize);
	const imgDataCurBig = ctxCurBig.getImageData(0, 0, canvasSize, canvasSize);

	let prevCount = 0;
	let curCount = 0;
	let overlapCount = 0;
	let excessCount = 0;

	for (let i = 0; i < imgDataPrev.data.length; i += 4) {
		// Check if the pixel is drawn in the "prev" path
		if (imgDataPrev.data[i + 3] > 0) {
			prevCount++;
			// Check if the corresponding pixel in the "cur" path is also drawn
			// use big for a softness to allow for close
			if (imgDataCurBig.data[i + 3] > 0) {
				overlapCount++;
			}
		}
	}

	for (let i = 0; i < imgDataCur.data.length; i += 4) {
		if (imgDataCur.data[i + 3] > 0) {
			curCount++;
			if (imgDataPrevBig.data[i + 3] <= 0) excessCount++;
		}
	}

	// Calculate the percentage
	const overlap = overlapCount / prevCount;
	const excess = excessCount / curCount;

	// add canvas to body for debugging
	// if (dev) {
	// 	// make container div for these
	// 	const div = document.createElement("div");
	// 	// create div to contain them
	// 	const divPrev = document.createElement("div");
	// 	const divCur = document.createElement("div");

	// 	// make them position relative and the canvas inside position absolute
	// 	divPrev.style.position = "relative";
	// 	divPrev.style.top = "320px";
	// 	divCur.style.position = "relative";

	// 	// make the canvas elements position absolute
	// 	canvasPrev.style.position = "absolute";
	// 	canvasCur.style.position = "absolute";
	// 	canvasPrevBig.style.position = "absolute";
	// 	canvasCurBig.style.position = "absolute";
	// 	// top 0 left 0
	// 	canvasPrev.style.top = "0";
	// 	canvasPrev.style.left = "0";
	// 	canvasCur.style.top = "0";
	// 	canvasCur.style.left = "0";
	// 	canvasPrevBig.style.top = "0";
	// 	canvasPrevBig.style.left = "0";
	// 	canvasCurBig.style.top = "0";

	// 	//make the canvas have transparent background
	// 	canvasPrev.style.backgroundColor = "rgba(0,0,0,0)";
	// 	canvasCur.style.backgroundColor = "rgba(0,0,0,0)";
	// 	canvasPrevBig.style.backgroundColor = "rgba(0,0,0,0)";
	// 	canvasCurBig.style.backgroundColor = "rgba(0,0,0,0)";

	// 	// attach to divs
	// 	divPrev.appendChild(canvasCurBig);
	// 	divPrev.appendChild(canvasPrev);

	// 	divCur.appendChild(canvasPrevBig);
	// 	divCur.appendChild(canvasCur);

	// 	// attach to container
	// 	div.appendChild(divPrev);
	// 	div.appendChild(divCur);

	// 	// attach to body
	// 	document.body.appendChild(div);
	// 	 await new Promise((r) => setTimeout(r, 10000));
	// }

	// remove the canvas elements
	canvasPrev.remove();
	canvasCur.remove();
	canvasPrevBig.remove();
	canvasCurBig.remove();

	if (dev)
		console.log({
			overlap,
			excess,
			validO: overlap > targetRatioOverlap,
			validE: excess < targetRatioExcess
		});

	return overlap > targetRatioOverlap && excess < targetRatioExcess;
}
