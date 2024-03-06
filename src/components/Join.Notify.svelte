<script>
	import { getContext, createEventDispatcher } from "svelte";
	const copy = getContext("copy");

	const dispatch = createEventDispatcher();

	export let value;
	export let noCredit;

	let name;
	let platform;
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
		invalid = email || phone ? invalidate() : false;

		if (!invalid) dispatch("update", { phone, email, name, platform });
	}
</script>

{#if !noCredit}
	<fieldset>
		<div class="credit">
			<p>{@html copy.join.credit}</p>
			<label for="name">Name/Handle <small>(optional)</small></label>
			<select bind:value={platform}>
				<option value="name">Name</option>
				<option value="tiktok">TikTok</option>
				<option value="instagram">Instagram</option>
				<option value="youtube">YouTube</option>
				<option value="bluesky">Bluesky</option>
				<option value="x">X</option>
			</select>
			<div>
				<input
					type="text"
					id="name"
					name="name"
					maxlength="30"
					placeholder="your name/handle"
					bind:value={name}
				/>
			</div>
		</div>
	</fieldset>
{/if}

<fieldset>
	<div class="notify">
		<p>{@html copy.join.notify}</p>
		<div>
			<label for="phone">Text <small>(optional)</small></label>
			<input
				type="tel"
				id="phone"
				name="phone"
				placeholder="123-456-7890"
				bind:value={phone}
			/>
		</div>
		<div>
			<label for="email">Email <small>(optional)</small></label>
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
		<p>{@html copy.join.message}</p>
	</div>
</fieldset>

<div class="action">
	<button
		disabled={value === "Submitting..."}
		on:click|preventDefault={onSubmit}>{value}</button
	>
	{#if invalid}
		<p class="invalid">{invalid}</p>
	{/if}
</div>

<style>
	fieldset {
		border: none;
		padding: 0;
	}

	label {
		margin-bottom: 4px;
	}

	fieldset div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 16px;
	}

	.info p {
		margin: 0;
	}

	.invalid {
		color: var(--color-secondary);
	}

	input {
		width: 100%;
	}

	input::placeholder {
		opacity: 0.5;
	}

	.action {
		margin-bottom: 64px;
	}

	select {
		color: var(--color-fg);
		margin-bottom: 16px;
		padding: 8px;
		background: transparent;
	}
</style>
