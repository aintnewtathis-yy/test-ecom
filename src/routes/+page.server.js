import { CMS_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	try {
		const products = await fetch(`${CMS_URL}/api/products?populate=*`);
		const productsData = await products.json();

		return {
            products: productsData
        };
	} catch (err) {
		console.log(err);
		error(404, {
			message: err
		});
	}
}
