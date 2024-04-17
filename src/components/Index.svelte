<script>
	import { browser } from "$app/environment";
	import { onMount, getContext } from "svelte";
	import FAQ from "$components/FAQ.svelte";
	import Scrub from "$components/Scrub.svelte";
	import { showFaq, showJoin } from "$stores/misc.js";

	const copy = getContext("copy");
	const components = { Scrub };

	$: if ((browser && $showFaq) || $showJoin) {
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.width = "100%";
	} else if (browser) {
		document.body.style.overflow = "auto";
		document.body.style.position = "static";
		document.body.style.width = "auto";
	}
	onMount(async () => {});
</script>

<section id="intro">
	<p>
		<small
			><a href="https://pudding.cool" target="_blank" rel="noreferer"
				>The Pudding</a
			> presents</small
		>
	</p>

	<h1>
		{@html copy.hed}
	</h1>

	<p class="warning">
		<details>
			<summary
				><small>Warning: {@html copy.draw.warningSummary} </small>
			</summary>
			<div>
				<p><small>{@html copy.draw.warningDetails}</small></p>
			</div>
		</details>
	</p>
</section>

<!-- <section class="hr"></section> -->

<section id="recap">
	{#each copy.recap as { type, value }}
		{#if type === "img"}
			<figure>
				<img src="assets/{value.src}" alt={value.alt} />
				<figcaption>{value.alt}</figcaption>
			</figure>
		{:else if type === "video"}
			<figure>
				<video></video>
				<figcaption>VIDEO TK</figcaption>
			</figure>
		{:else if type === "component"}
			<svelte:component this={components[value]} />
		{:else}
			<p>{@html value}</p>
		{/if}
	{/each}
</section>

<section class="hr"></section>

<footer>
	<section>
		<FAQ />
		<p>{@html copy.recirc}</p>
	</section>
</footer>

<style>
	#intro p {
		margin: 32px auto;
	}

	#intro p.warning {
		margin-top: 8px;
	}

	summary {
		cursor: pointer;
	}

	#intro details p {
		margin: 0;
	}

	footer {
		margin: 32px auto;
	}

	img {
		border: 2px solid var(--color-fg);
	}
</style>
