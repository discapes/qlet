<script lang="ts">
	import type { PageData } from './$types';
	import '../../app.css';

	export let data: PageData;
	let list = data.list.map((s: any) => ({ fi: { text: s.fi }, sv: { text: s.sv } }));

	function onKD(e: KeyboardEvent, item: any) {
		if (e.key === 'Enter') {
			item.cor = item.val.length >= 3 && item.text.includes(item.val);
			list = list;
		}
	}

	function onHideFi(e: any) {
		list.forEach((s: any) => (s.fi.q = e.target.checked));
		list = list;
	}
	function onHideSv(e: any) {
		list.forEach((s: any) => (s.sv.q = e.target.checked));
		list = list;
	}
</script>

<main class="overflow-auto">
	<a href="/"><h1 class="underline">qlet</h1></a>
	<div class="flex justify-center">
		<div class="grid grid-cols-2 gap-3 pb-10">
			<div class="bg-white/80 p-1 rounded">
				<input type="checkbox" on:change={onHideFi} /> <b>suomi</b>
			</div>
			<div class="bg-white/80 p-1 rounded">
				<input type="checkbox" on:change={onHideSv} /> <b>>svenska</b>
			</div>
			{#each list as word, i}
				<div
					class="flex p-1 rounded bg-white/50 gap-1 items-center {word.fi.cor != null
						? !word.fi.cor
							? 'bg-rose-200'
							: 'bg-lime-300'
						: ''}"
				>
					<input type="checkbox" bind:checked={word.fi.q} />
					{#if word.fi.q}
						<input
							class="bg-transparent w-full"
							on:keydown={(e) => onKD(e, word.fi)}
							bind:value={word.fi.val}
						/>
					{:else}
						<div class="whitespace-pre-line">
							{word.fi.text}
						</div>
					{/if}
				</div>
				<div
					class="flex p-1 rounded bg-white/50 gap-1 items-center {word.sv.cor != null
						? !word.sv.cor
							? 'bg-rose-200'
							: 'bg-lime-300'
						: ''}"
				>
					<input type="checkbox" bind:checked={word.sv.q} />
					{#if word.sv.q}
						<input
							class="bg-transparent w-full"
							on:keydown={(e) => onKD(e, word.sv)}
							bind:value={word.sv.val}
						/>
					{:else}
						<div class="whitespace-pre-line">
							{word.sv.text}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
</style>
