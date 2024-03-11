import { dev } from "$app/environment";
import getPathLength from "$utils/getPathLength.js";
import overlapPercent from "$utils/overlapPercent.js";

export default function validateLine({ cur, prev, canvasSize, strokeWidth }) {
	const lineLengthCur = getPathLength(cur);
	const lineLengthPrev = getPathLength(prev);
	const lineLengthMax = Math.max(lineLengthCur, lineLengthPrev);

	if (dev) console.log({ lineLengthCur, lineLengthPrev, lineLengthMax });

	let lengthRatio = 0;
	if (lineLengthCur < lineLengthPrev)
		lengthRatio = lineLengthCur / lineLengthPrev;
	else lengthRatio = lineLengthPrev / lineLengthCur;

	let targetRatioLength = 0.5;
	let targetRatioOverlap = 0.5;
	let targetRatioExcess = 0.5;
	if (lineLengthMax > 100) targetRatioLength = 0.6;
	if (lineLengthMax > 200) targetRatioLength = 0.7;
	if (lineLengthMax > 400) {
		targetRatioLength = 0.8;
		targetRatioOverlap = 0.6;
		targetRatioExcess = 0.4;
	}
	if (lineLengthMax > 600) {
		targetRatioLength = 0.9;
		targetRatioOverlap = 0.7;
		targetRatioExcess = 0.3;
	}

	const overlap = overlapPercent({
		prev,
		cur,
		strokeWidth,
		canvasSize,
		targetRatioOverlap,
		targetRatioExcess
	});

	const passL = lengthRatio >= targetRatioLength;
	const passO = overlap;

	const valid = passL && passO;

	if (dev)
		console.log({
			lengthRatio,
			targetRatioLength,
			targetRatioOverlap,
			targetRatioExcess,
			passL,
			passO,
			valid
		});

	return valid;
}
