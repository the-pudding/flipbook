<script>
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
</script>

<section id="playground">
	<p>{@html copy.playground}</p>
	<Canvas>
		<div slot="ui">
			<button>Add Frame</button>
			<button>Delete Frame</button>
		</div>
	</Canvas>
	<button>Share Animation</button>
</section>
