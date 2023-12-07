<script>
	import { showFaq } from "$stores/misc.js";
	import copy from "$data/copy.json";
</script>

<div id="faq" class:visible={$showFaq}>
	<ul>
		{#each copy.faq as { q, a }}
			<li>
				<h3>{q}</h3>
				<p>{@html a}</p>
			</li>
		{/each}
	</ul>
	<button on:click={() => ($showFaq = false)}>Close</button>
</div>

<style>
	#faq {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: auto;
		padding: 16px;
		background-color: var(--color-bg);
		color: var(--color-fg);
		z-index: var(--z-overlay);
		display: none;
	}

	#faq.visible {
		display: block;
	}

	li {
		list-style-type: none;
	}
</style>
