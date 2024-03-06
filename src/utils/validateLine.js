import { dev } from "$app/environment";
import { rebalanceCurve } from "curve-matcher";
import lineLength from "$utils/lineLength.js";
import overlapPercent from "$utils/overlapPercent.js";

export default function validateLine({ cur, prev, canvasSize, strokeWidth }) {
	const numPoints = Math.max(prev.length, cur.length);

	const lineCur = rebalanceCurve(cur, { numPoints });
	const linePrev = rebalanceCurve(prev, { numPoints });
	const lineLengthCur = lineLength(lineCur, true);
	const lineLengthPrev = lineLength(linePrev, true);
	const lineLengthMax = Math.max(lineLengthCur, lineLengthPrev);

	let lengthRatio = 0;
	if (lineLengthCur < lineLengthPrev)
		lengthRatio = lineLengthCur / lineLengthPrev;
	else lengthRatio = lineLengthPrev / lineLengthCur;

	let targetRatio = 0.5;
	let targetRatioOverlap = 0.5;
	let targetRatioExcess = 0.5;
	if (lineLengthMax > 50) targetRatio = 0.6;
	if (lineLengthMax > 100) targetRatio = 0.7;
	if (lineLengthMax > 200) {
		targetRatio = 0.8;
		targetRatioOverlap = 0.6;
		targetRatioExcess = 0.4;
	}
	if (lineLengthMax > 300) {
		targetRatio = 0.9;
		targetRatioOverlap = 0.7;
		targetRatioExcess = 0.3;
	}

	if (dev)
		console.log({
			lengthRatio,
			targetRatio,
			targetRatioOverlap,
			targetRatioExcess
		});
	const overlap = overlapPercent({
		prev,
		cur,
		strokeWidth,
		canvasSize,
		targetRatioOverlap,
		targetRatioExcess
	});

	const passL = lengthRatio >= targetRatio;
	const passO = overlap;

	const valid = passL && passO;

	return valid;
}
