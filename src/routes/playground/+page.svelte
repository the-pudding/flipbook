<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Playground from "$components/Playground.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	export let data;

	version();

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
	setContext("data", data.data);
</script>

<Meta {title} {description} {url} {keywords} />
<Playground note={copy.playgroundNote} />
