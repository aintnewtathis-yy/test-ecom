<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCartState } from '$lib/cart.svelte';

	let { data } = $props();

	const products = getCartState();

	let cartOpen = $state(false);
</script>

<div class="z-10 flex flex-col gap-2">
	<Button
		onclick={() => {
			cartOpen = !cartOpen;
			console.log(products.cartProducts.length);
		}}
	>
		Cart
	</Button>
	{#if cartOpen}
		<div
			class="absolute right-0 top-full flex w-64 flex-col gap-3 rounded bg-slate-200 p-2"
			class:hidden={products.cartProducts.length === 0}
		>
			{#if products.cartProducts.length === 0}
				<div class="flex flex-col gap-2">
					<p>Cart is empty</p>
					<Button>View cart</Button>
				</div>
			{:else}
				{#each products.cartProducts as product}
					<div class="grid shrink-0 grow-0 grid-cols-2 gap-2">
						<img class="aspect-square object-cover" src={data.CMS_URL + product.thumbnail} alt="" />
						<div class="flex shrink-0 grow-0 flex-col gap-2">
							<p>{product.title}</p>
							<p>{product.price}</p>
						</div>
					</div>
				{/each}
				<Button class={'mt-2'} href="/cart">View cart</Button>
			{/if}
		</div>
	{/if}
</div>