<script>
	import "$styles/app.css";
	import Header from "$components/Header.svelte";
	import FAQ from "$components/FAQ.svelte";
</script>

<Header />
<main id="content">
	<slot />
	<FAQ />
</main>
