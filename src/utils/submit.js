import { dev } from "$app/environment";
import { page } from "$app/stores";
import { get } from "svelte/store";

function getToken() {
	const obj = get(page);
	return obj.url.search.split("token=")[1];
}

export default async function submit(endpoint, data) {
	const url = "https://pudding-server-utils.herokuapp.com/trace";
	// const url = "http://localhost:5000/trace";

	const token = dev ? getToken() : "";

	try {
		const start = Date.now();
		const body = JSON.stringify({ endpoint, data });
		const options = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-Pudding-Token": token
			},
			credentials: "include",
			body
		};

		const response = await fetch(url, options);
		const result = await response.json();
		const end = Date.now();
		const duration = `${end - start}ms`;
		return { ...result, duration };
	} catch (err) {
		throw err;
	}
}
