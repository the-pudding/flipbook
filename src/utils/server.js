import { dev } from "$app/environment";
import getParam from "$utils/getParam.js";

export default async function server(endpoint, data) {
	const base = "https://pudding-flipbook-server-5a76bc9eb168.herokuapp.com/";
	// const base = "http://localhost:5000";
	const url = `${base}/${endpoint}`;

	const token = dev ? getParam("token") : "";

	try {
		const start = Date.now();
		const body = JSON.stringify(data);
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
		console.log(err?.message);
		throw err;
	}
}
