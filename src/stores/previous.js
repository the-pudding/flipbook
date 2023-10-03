import { derived } from "svelte/store";

export default function previous(store) {
	let p = null;

	return derived(store, (current) => {
		const previous = p;
		p = current;
		return previous;
	});
}
