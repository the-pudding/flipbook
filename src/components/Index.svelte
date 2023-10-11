<script>
	import { getContext } from "svelte";
	import Canvas from "$components/Canvas.svelte";
	const copy = getContext("copy");
	const data = getContext("data");

	let isNotRobot;
</script>

<section>
	<h1>
		<strong>{@html copy.cta}</strong>
	</h1>
	<p>
		{@html copy.definition}
	</p>
</section>

<section>
	<form class="shadow">
		<p class="prompt">{@html copy.prompt}</p>
		<fieldset>
			<div>
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="example@email.com"
				/>
			</div>
			<!-- <p>OR</p> -->
			<div>
				<label for="phone">Text message</label>
				<input type="tel" id="phone" name="phone" placeholder="123-456-7890" />
			</div>
			<div>
				<label for="robot">I’m not a robot</label>
				<input
					type="checkbox"
					id="robot"
					name="robot"
					bind:checked={isNotRobot}
				/>
				<div class="robot" class:visible={isNotRobot}>
					<Canvas robot={true} />
				</div>
			</div>
		</fieldset>

		<p><input type="submit" value="Submit" /></p>

		<div class="info">
			<p>{@html copy.messageP}:</p>
			<ul>
				{#each copy.messageLi as li}
					<li>{@html li}</li>
				{/each}
			</ul>
		</div>
	</form>
</section>

<style>
	form {
		padding: 16px;
		margin: 32px auto;
	}

	.prompt,
	form > div p {
		margin-top: 0;
	}

	fieldset {
		border: none;
		padding: 0;
	}

	fieldset div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 8px;
	}

	label {
		font-size: var(--12px);
		margin-bottom: 4px;
	}

	.info {
		background: #efefef;
		padding: 16px;
		margin-top: 32px;
	}

	.info p {
		margin-bottom: 8px;
	}

	.info p,
	li {
		font-size: var(--14px);
	}

	.robot {
		display: none;
	}

	.robot.visible {
		display: block;
	}
</style>
