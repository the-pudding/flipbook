<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
	const data = getContext("data");
</script>

<p>
	This is the telephone game, but visual. Copy the <mark
		>last person’s drawing</mark
	> as best you can.
</p>

<Canvas />

<style>
	p {
		max-width: 300px;
		margin: 16px auto;
	}

	mark {
		background: pink;
	}
</style>
