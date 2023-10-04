<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
	const data = getContext("data");
</script>

<p>
	This is the basically the <a
		target="_blank"
		rel="noreferrer"
		href="https://en.wikipedia.org/wiki/Chinese_whispers">telephone game</a
	>, but visual and massively collaborative.
</p>

<p>
	Copy the <mark>last person’s drawing</mark> as best you can.
</p>

<p>
	(since this is testing you just can keep submitting new ones to see a little
	animation develop)
</p>

<Canvas />

<style>
	p {
		max-width: 300px;
		margin: 16px auto;
	}

	mark {
		background: rgba(255, 0, 0, 0.5);
	}
</style>
