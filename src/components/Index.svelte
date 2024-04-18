<script>
	import { browser } from "$app/environment";
	import { onMount, getContext } from "svelte";
	import FAQ from "$components/FAQ.svelte";
	import Scrub from "$components/Scrub.svelte";
	import Footer from "$components/Footer.svelte";
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
		<a href="https://pudding.cool" target="_blank" rel="noreferer"
			><img src="assets/wordmark.png" alt="The Pudding" /></a
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
				<div class="yt">
					<iframe
						title="video"
						width="320"
						height="320"
						src="https://www.youtube-nocookie.com/embed/{value.src}"
						frameborder="0"
						allow="autoplay; encrypted-media"
						allowfullscreen
					></iframe>
				</div>
				<figcaption>{value.alt}</figcaption>
			</figure>
		{:else if type === "component"}
			<svelte:component this={components[value]} />
		{:else}
			<p>{@html value}</p>
		{/if}
	{/each}
</section>

<section class="hr"></section>

<section id="qs">
	<FAQ />
</section>

<Footer></Footer>

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

	#intro a img {
		border: none;
		max-width: 8em;
	}

	#intro a {
		border: none;
	}

	#qs {
		margin: 32px auto;
	}

	img {
		border: 2px solid var(--color-fg);
	}

	.yt {
		position: relative;
		overflow: hidden;
		/* padding-top: 56.25%; */
		padding-top: 100%;
		background: none;
	}

	.yt iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 2px solid var(--color-fg);
	}
</style>
