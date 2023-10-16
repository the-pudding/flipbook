<script>
	import { getContext, createEventDispatcher } from "svelte";
	const copy = getContext("copy");

	const dispatch = createEventDispatcher();

	export let value;

	let phone;
	let email;
	let invalid;

	function invalidate() {
		const validPhone = phone
			? phone?.replace(/\D/g, "").trim().length === 10
			: true;
		const validEmail = email
			? email?.includes("@") && email?.includes(".")
			: true;
		if (!validPhone) return "Invalid phone number";
		if (!validEmail) return "Invalid email address";
		return false;
	}

	function onSubmit() {
		invalid =
			email || phone ? invalidate() : "Enter a phone number or email address";

		if (!invalid) dispatch("update", { phone, email });
	}
</script>

<fieldset>
	<div class="step notify">
		<p>{@html copy.stepNotify}</p>
		<div>
			<label for="phone">Text message (US number)</label>
			<input
				type="tel"
				id="phone"
				name="phone"
				placeholder="123-456-7890"
				bind:value={phone}
			/>
		</div>
		<div>
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				placeholder="example@email.com"
				bind:value={email}
			/>
		</div>
	</div>

	<div class="info">
		<p>{@html copy.messageP}:</p>
		<ul>
			{#each copy.messageLi as li}
				<li>{@html li}</li>
			{/each}
		</ul>
	</div>
</fieldset>

<button on:click|preventDefault={onSubmit}>{value}</button>
{#if invalid}
	<p class="invalid">{invalid}</p>
{/if}

<style>
	.info {
		padding: 16px 0;
	}

	.info p {
		margin-bottom: 8px;
	}

	.info p,
	li {
		font-size: var(--14px);
	}
</style>
