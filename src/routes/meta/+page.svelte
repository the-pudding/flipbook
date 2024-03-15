<script>
	import { onMount } from "svelte";

	let publicData;
	let updated;
	let secondsAgo;

	function tick() {
		if (!publicData) secondsAgo = "?";
		else
			secondsAgo = Math.floor(
				(Date.now() - new Date(publicData.updated)) / 1000
			);
	}

	async function update() {
		const url = "https://pudding.cool/projects/flipbook-data/meta.json";
		const response = await fetch(`${url}?version=${Date.now()}`);
		publicData = await response.json();

		updated = new Date(publicData.updated).toLocaleString();
		setTimeout(update, 5000);
	}

	onMount(async () => {
		update();
		setInterval(tick, 1000);
	});
</script>

<section>
	<h1>Meta</h1>

	<p>last update: {secondsAgo} seconds ago</p>
	<p><small>{updated}</small></p>
</section>

<section>
	<h2>Public Data</h2>
	<pre>
		<code>
{JSON.stringify(publicData, null, 2)}
	</code>
	</pre>
</section>

<style>
	h1 {
		margin-top: 32px;
	}

	section {
		padding: 0 16px;
		max-width: 1600px;
		width: 90%;
		margin-bottom: 64px;
	}

	h2 {
		margin: 8px 0;
	}
</style>
