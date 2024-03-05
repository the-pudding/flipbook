<script>
	import { page } from "$app/stores";
	$: showHeader = $page?.route?.id !== "admin";
	$: showFAQ = $page?.route?.id === "/";
	import wordmark from "$svg/wordmark.svg";
	import { showFaq } from "$stores/misc.js";
</script>

{#if showHeader}
	<header>
		<!-- <div class="wordmark">
			<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
				>{@html wordmark}</a
			>
		</div> -->
		{#if showFAQ}
			<div class="faq">
				<button on:click={() => ($showFaq = true)}>FAQ</button>
			</div>
		{/if}
	</header>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
	}

	.wordmark {
		width: 10em;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(.wordmark svg path) {
		fill: currentColor;
	}
</style>
