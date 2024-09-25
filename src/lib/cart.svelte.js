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

    add( documentId, title, quantity, price, thumbnail){
        this.cartProducts.push({
            documentId,
            title,
            quantity,
            price,
            thumbnail
        })
    }

    remove(documentId) {
        
    }
}

const CART_KEY = Symbol('CART')

export function setCartState() {
    return setContext(CART_KEY, new CartState())
}

export function getCartState() {
    return getContext(CART_KEY)
}