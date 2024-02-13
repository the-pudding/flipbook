<script>
	import { showFaq } from "$stores/misc.js";
	import copy from "$data/copy.json";
</script>

<div id="faq" class:visible={$showFaq}>
	<h2>FAQ</h2>
	<ul>
		{#each copy.faq as { q, a }}
			<li>
				<h3><strong>{q}</strong></h3>
				<p>{@html a}</p>
			</li>
		{/each}
	</ul>
	<button class="close" aria-label="close" on:click={() => ($showFaq = false)}
		>X</button
	>
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
		border: 2vw solid var(--color-fg);
		padding-right: 4em;
	}

	ul {
		margin-bottom: 15vh;
	}

	li {
		margin-bottom: 1em;
	}

	#faq.visible {
		display: block;
	}

	.close {
		position: absolute;
		width: 2em;
		aspect-ratio: 1;
		top: 16px;
		right: 16px;
		z-index: 1;
	}
</style>
