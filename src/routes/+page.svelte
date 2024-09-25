<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCartState } from '$lib/cart.svelte';
	import { addToCart } from '$lib/my-utils';

	let { data } = $props();

	console.log(data);

	const cartProducts = getCartState();
</script>

<div class="mt-12 grid grid-cols-4 gap-4">
	{#each data.products.data as product}
		<div class="flex flex-col gap-3" data-id={product.documentId}>
			<img
				class="aspect-square w-full rounded object-cover object-top"
				src={data.CMS_URL + product?.thumbnail?.url}
				alt={product?.thumbnail?.alternativeText}
			/>

			<div class="flex justify-between gap-2">
				<p class="text-gray-400">{product?.title}</p>
				<p class="text-gray-600">${product?.price}</p>
			</div>
			<Button class={'mt-auto'} onclick={(e) => {addToCart(product, cartProducts)}} data-id={product.documentId}>asd</Button>
		</div>
	{/each}
</div>
