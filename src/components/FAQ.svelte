<script>
	import { showFaq, showJoin } from "$stores/misc.js";
	import copy from "$data/copy.json";

	function onSignup() {
		$showFaq = false;
		$showJoin = true;
	}
</script>

<details>
	<summary><h2>FAQ</h2></summary>
	<div class="contents">
		<ul>
			{#each copy.faq as { q, a }}
				<li>
					<h3><strong>{q}</strong></h3>
					<p><small>{@html a}</small></p>
				</li>
			{/each}
			<li>
				<h3><strong>How can I watch the final animation?</strong></h3>
				<p><button on:click={onSignup}>Sign up</button> to get notified.</p>
			</li>
		</ul>
	</div>
</details>

<style>
	h2 {
		margin: 0;
		display: inline-block;
	}
	ul,
	li {
		padding: 0;
		list-style-type: none;
	}

	details {
		cursor: pointer;
		margin-bottom: 16px;
	}
</style>
