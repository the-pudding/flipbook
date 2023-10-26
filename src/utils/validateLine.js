import {
	shapeSimilarity,
	frechetDistance,
	rebalanceCurve
} from "curve-matcher";
import lineLength from "$utils/lineLength.js";

export default function validateLine({ cur, prev, diagonal }) {
	const numPoints = Math.max(prev.length, cur.length);

	const lineCur = rebalanceCurve(cur, { numPoints });
	const linePrevF = rebalanceCurve(prev, { numPoints });
	const linePrevR = [...linePrevF].reverse();

	const opts = { estimationPoints: 200, rotations: 30 };
	const simF = shapeSimilarity(linePrevF, lineCur, opts);
	const simR = shapeSimilarity(linePrevR, lineCur, opts);

	const lineLengthCur = lineLength(lineCur, true);
	const lineLengthPrev = lineLength(linePrevF, true);
	const lineLengthMax = Math.max(lineLengthCur, lineLengthPrev);
	const ll = Math.abs(lineLengthCur / lineLengthPrev - 1);

	const frechetF = frechetDistance(linePrevF, lineCur);
	const frechetR = frechetDistance(linePrevR, lineCur);
	const diagF = frechetF / diagonal;
	const diagR = frechetR / diagonal;
	const lenF = frechetF / lineLengthMax;
	const lenR = frechetR / lineLengthMax;

	let targetLL = 0.075;
	if (lineLengthPrev < 100) targetLL = 0.2;
	if (lineLengthPrev < 200) targetLL = 0.15;
	if (lineLengthPrev < 300) targetLL = 0.1;

	const passF = ll < targetLL && simF > 0.9 && (diagF < 0.2 || lenF < 0.2);
	const passR = ll < targetLL && simR > 0.9 && (diagR < 0.2 || lenR < 0.2);
	const valid = passF || passR;
	return {
		valid,
		debug1: {
			ll_target: targetLL,
			ll: +ll.toFixed(2),
			sim: +simF.toFixed(2),
			diag: +diagF.toFixed(2),
			len: +lenF.toFixed(2),
			pass: passF
		},
		debug2: {
			ll_target: targetLL,
			ll: +ll.toFixed(2),
			sim: +simR.toFixed(2),
			diag: +diagR.toFixed(2),
			len: +lenR.toFixed(2),
			pass: passR
		}
	};
}
