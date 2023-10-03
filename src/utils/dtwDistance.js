export default function dtwDistance(s, t) {
	let n = s.length;
	let m = t.length;
	let DTW = [];

	for (let i = 0; i <= n; i++) {
		DTW[i] = [];
	}

	for (let i = 1; i <= n; i++) {
		DTW[i][0] = Infinity;
	}
	for (let i = 1; i <= m; i++) {
		DTW[0][i] = Infinity;
	}
	DTW[0][0] = 0;

	for (let i = 1; i <= n; i++) {
		for (let j = 1; j <= m; j++) {
			let cost = Math.sqrt(
				Math.pow(s[i - 1][0] - t[j - 1][0], 2) +
					Math.pow(s[i - 1][1] - t[j - 1][1], 2)
			);
			DTW[i][j] =
				cost + Math.min(DTW[i - 1][j], DTW[i][j - 1], DTW[i - 1][j - 1]);
		}
	}

	return DTW[n][m];
}
