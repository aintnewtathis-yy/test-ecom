import { CMS_URL } from '$env/static/private';

export async function load({ fetch }) {
	try {
		const products = await fetch(`${CMS_URL}/api/products?populate=*`);
		const productsData = await products.json();

		return {
            products: productsData
        };
	} catch (error) {
		console.log(error);
		throw error(404, 'error');
	}
}
