<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { getCartState } from '$lib/cart.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();

	const products = getCartState();

    console.log(products)
</script>

<div class="mx-auto mt-32 flex w-6/12 flex-col gap-5">
	<h1 class="px-2 text-xl font-medium">Cart</h1>
	<Table.Root>
		<Table.Caption>A list of your recent invoices.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Photo</Table.Head>
				<Table.Head>title</Table.Head>
				<Table.Head>quantity</Table.Head>
				<Table.Head class="text-right">price</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each products.cartProducts as product}
				<Table.Row>
					<Table.Cell class="font-medium">
                        <img src={data.CMS_URL + product.thumbnail} alt="">
                    </Table.Cell>
					<Table.Cell>{product.title}</Table.Cell>
					<Table.Cell>{product.quantity}</Table.Cell>
					<Table.Cell class="text-right">${product.price}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
