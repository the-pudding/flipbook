<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
	const data = getContext("data");
</script>

<p>
	{@html copy.task}
</p>

<Canvas />

<style>
	p {
		max-width: 300px;
		margin: 16px auto;
	}
</style>
