<script>
	import '../app.css';
	import Cart from '$lib/components/Cart.svelte';
	import { setCartState } from '$lib/cart.svelte';

	let {data, children} = $props()

	setCartState();
</script>

<div class="container">
	<header class="flex justify-end">
		<Cart {data} />
	</header>
	{@render children()}
</div>
