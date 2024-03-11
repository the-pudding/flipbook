export default function getPathLength(d) {
	const svgNS = "http://www.w3.org/2000/svg";
	const path = document.createElementNS(svgNS, "path");
	path.setAttribute("d", d);
	return path.getTotalLength();
}
