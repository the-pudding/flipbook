import { page } from "$app/stores";
import { get } from "svelte/store";

export default function getParam(param) {
	const obj = get(page);
	const items = obj.url.search.split("&");
	const item = items.find((item) => item.includes(`${param}=`));
	if (item) return item.split("=")[1];
	return;
}
