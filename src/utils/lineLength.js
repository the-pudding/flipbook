export default function lineLength(points, useProps = false) {
	let length = 0;

	for (let i = 1; i < points.length; i++) {
		const p1 = points[i - 1];
		const p2 = points[i];
		if (useProps) {
			length += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
		} else {
			length += Math.sqrt(
				Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)
			);
		}
	}

	return length;
}
