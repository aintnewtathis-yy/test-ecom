import { setContext, getContext, onDestroy, onMount } from "svelte"

export class CartState {
    localStorageCart = null
    cartProducts = $state([])

    constructor() {
        onMount(() => {
            this.localStorageCart = JSON.parse(localStorage.getItem('cartProducts')) ?? []
            this.cartProducts = this.localStorageCart
        })

        $effect(() => {
            localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts))
        })
    }

    add(title, quantity, price, thumbnail){
        const id = crypto.randomUUID()

        this.cartProducts.push({
            id,
            title,
            quantity,
            price,
            thumbnail
        })
    }

    remove(id) {
        
    }
}

const CART_KEY = Symbol('CART')

export function setCartState() {
    return setContext(CART_KEY, new CartState())
}

export function getCartState() {
    return getContext(CART_KEY)
}