import { dev } from "$app/environment";

function pointsToPath(points) {
	return (
		points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z"
	);
}

export default function overlapPercent({
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
	ctxPrev.strokeStyle = "black";
	ctxCur.strokeStyle = "black";
	ctxPrevBig.strokeStyle = "black";
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
	if (dev)
		console.log({
			prevCount,
			curCount,
			overlap,
			excess
		});

	// remove the canvas elements
	canvasPrev.remove();
	canvasCur.remove();
	canvasPrevBig.remove();
	canvasCurBig.remove();
	return overlap > targetRatioOverlap && excess < targetRatioExcess;
}
