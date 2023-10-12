<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
	const data = getContext("data");
</script>

<p>
	<!-- {@html copy.task} -->
	Your task is to trace the
	<mark><strong>last person’s drawing</strong></mark> as best you can.
</p>

<Canvas />

<style>
	p {
		max-width: 300px;
		margin: 16px auto;
	}

	mark {
		background: none;
		padding: 0;
		background-image: linear-gradient(
			rgba(255, 0, 0, 0.5),
			rgba(255, 0, 0, 0.5)
		);
		background-size: 100% 0.3em;
		background-position: 0 100%;
		background-repeat: no-repeat;
	}
</style>
