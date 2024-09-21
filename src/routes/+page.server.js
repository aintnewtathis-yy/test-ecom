/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const products = await fetch('http://localhost:1337/api/products?populate=*');
		const productsData = await products.json();

		return {
            products: productsData
        };
	} catch (error) {
		console.log(error);
		throw error(404, 'error');
	}
}
