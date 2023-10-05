export default function lineLength(points) {
	let length = 0;

	for (let i = 1; i < points.length; i++) {
		const p1 = points[i - 1];
		const p2 = points[i];
		length += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	}

	return length;
}
