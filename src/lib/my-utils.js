export const addToCart = (product, cartContext) => {
    const result = cartContext.cartProducts.filter(
        (cartProduct) => cartProduct.documentId === product.documentId
    );

    if (result.length > 0) {
        result[0].quantity++
    } else {
        cartContext.add(
            product.documentId,
            product.title,
            1,
            product.price,
            product?.thumbnail?.url
        );
    }
}