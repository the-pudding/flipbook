import {
	shapeSimilarity,
	frechetDistance,
	rebalanceCurve
} from "curve-matcher";
import lineLength from "$utils/lineLength.js";

export default function validateLine({ cur, prev, diagonal }) {
	const numPoints = Math.max(prev.length, cur.length);

	const lineCur = rebalanceCurve(cur, { numPoints });
	const linePrev = rebalanceCurve(prev, { numPoints });
	const linePrevR = [...linePrev].reverse();

	const opts = { estimationPoints: 200, rotations: 30 };
	const similarity = shapeSimilarity(linePrev, lineCur, opts);
	const similarityR = shapeSimilarity(linePrevR, lineCur, opts);

	const lineLengthCur = lineLength(lineCur);
	const lineLengthPrev = lineLength(linePrev);
	const lineLengthMax = Math.max(lineLengthCur, lineLengthPrev);

	const frechet = frechetDistance(linePrev, lineCur);
	const frechetR = frechetDistance(linePrevR, lineCur);
	const diag = frechet / diagonal;
	const diagR = frechetR / diagonal;
	const len = frechet / lineLengthMax;
	const lenR = frechetR / lineLengthMax;

	const pass = similarity >= 0.9 && (diag <= 0.2 || len <= 0.5);
	const passR = similarityR >= 0.9 && (diagR <= 0.2 || lenR <= 0.5);
	const valid = pass || passR;
	return {
		valid,
		debug1: {
			similarity: similarity.toFixed(2),
			diag: diag.toFixed(2),
			len: len.toFixed(2),
			pass
		},
		debug2: {
			similarity: similarityR.toFixed(2),
			diag: diagR.toFixed(2),
			len: lenR.toFixed(2),
			pass: passR
		}
	};
}
