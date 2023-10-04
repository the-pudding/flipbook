function lineLength(points) {
	let length = 0;
	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i - 1];
		const [x2, y2] = points[i];
		length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}
	return length;
}

export default function resampleLine(line, numPoints) {
	const resampled = [];
	const totalLength = lineLength(line);
	const interval = totalLength / (numPoints - 1);
	let accumulatedDist = 0;

	let currentPoint = line[0];
	resampled.push(currentPoint);

	let nextPointIndex = 1;

	while (resampled.length < numPoints && nextPointIndex < line.length) {
		const nextPoint = line[nextPointIndex];
		const distToNextPoint = Math.sqrt(
			Math.pow(nextPoint[0] - currentPoint[0], 2) +
				Math.pow(nextPoint[1] - currentPoint[1], 2)
		);

		if (accumulatedDist + distToNextPoint >= interval) {
			const t = (interval - accumulatedDist) / distToNextPoint;
			const interpolatedPoint = [
				currentPoint[0] + t * (nextPoint[0] - currentPoint[0]),
				currentPoint[1] + t * (nextPoint[1] - currentPoint[1])
			];
			resampled.push(interpolatedPoint);
			currentPoint = interpolatedPoint; // Move from the interpolated point
			accumulatedDist = 0;
		} else {
			accumulatedDist += distToNextPoint;
			currentPoint = nextPoint;
			nextPointIndex++;
		}
	}

	return resampled;
}
