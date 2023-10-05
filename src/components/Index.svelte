<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
	const data = getContext("data");
</script>

<p>
	<strong>Help make the world’s most collaborative animated film.</strong> This
	is basically the
	<a
		target="_blank"
		rel="noreferrer"
		href="https://en.wikipedia.org/wiki/Chinese_whispers">telephone game</a
	>, but visual.
</p>

<p>
	Your task is to trace the <br /><mark
		><strong>last person’s drawing</strong></mark
	> as best you can.
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
