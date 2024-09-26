<script>
	import { enhance } from '$app/forms';
    import { getCartState } from '$lib/cart.svelte';
    import * as Table from '$lib/components/ui/table/index.js';

    let { data } = $props();

    const products = getCartState();
</script>

<div class="mx-auto mb-64 mt-32 flex w-6/12 flex-col gap-5">
    <h1 class="px-2 text-xl font-medium">Cart</h1>
    <Table.Root>
        <Table.Caption>A list of your recent invoices.</Table.Caption>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-[100px]">Photo</Table.Head>
                <Table.Head>Title</Table.Head>
                <Table.Head>Quantity</Table.Head>
                <Table.Head class="text-right">Price</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each products.cartProducts as product}
                <Table.Row data-documentid={product.documentId}>
                    <Table.Cell class="font-medium">
                        <img src={data.CMS_URL + product.thumbnail} alt="" data-thumbnail />
                    </Table.Cell>
                    <Table.Cell data-title>{product.title}</Table.Cell>
                    <Table.Cell>
                        <!-- Quantity update buttons -->
                        <button onclick={() => product.quantity = Math.max(product.quantity - 1, 1)}>-</button>
                        <input type="hidden" name="quantity" value={product.quantity} />
                        <span data-quantity>{product.quantity}</span>
                        <button onclick={() => product.quantity++}>+</button>
                    </Table.Cell>
                    <Table.Cell class="text-right" data-price>${product.price * product.quantity}</Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>

    <!-- Form Submission -->
    <form method="POST" use:enhance action="?/buy">
        <input type="hidden" name="productsArray" value={JSON.stringify({
            order_status: 'pending',
            total: products.cartProducts.reduce((acc, product) => acc + product.price * product.quantity, 0),
            order_id: crypto.randomUUID(),
            products: products.cartProducts.map(p => ({
                product: { connect: [p.documentId] },
                title: p.title,
                quantity: p.quantity
            }))
        })} />

        <!-- Product Document ID for server processing -->
        <input type="hidden" name="documentId" value={products.cartProducts[0]?.documentId} />

        <button type="submit">Buy</button>
    </form>
</div>
