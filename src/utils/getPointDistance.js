export default function getPointDistance(prev, cur) {
	const prevA = prev[0];
	const curA = cur[0];
	const prevB = prev[prev.length - 1];
	const curB = cur[cur.length - 1];
	// find cumulative distance between each pairing
	const aa = Math.sqrt(
		Math.pow(curA[0] - prevA[0], 2) + Math.pow(curA[1] - prevA[1], 2)
	);
	const bb = Math.sqrt(
		Math.pow(curB[0] - prevB[0], 2) + Math.pow(curB[1] - prevB[1], 2)
	);
	const sameDir = aa + bb;
	const ab = Math.sqrt(
		Math.pow(curB[0] - prevA[0], 2) + Math.pow(curB[1] - prevA[1], 2)
	);
	const ba = Math.sqrt(
		Math.pow(curA[0] - prevB[0], 2) + Math.pow(curA[1] - prevB[1], 2)
	);

	const reverseDir = ab + ba;

	if (sameDir < reverseDir) return Math.max(aa, bb);
	return Math.max(ab, ba);
}
