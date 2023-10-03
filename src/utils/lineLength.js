export default function lineLength(points) {
	let length = 0;

	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i - 1];
		const [x2, y2] = points[i];
		length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	return length;
}
