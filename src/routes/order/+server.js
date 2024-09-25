import { CMS_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { initialPayment } from '$lib/yookassa.js';

export async function POST({ request }) {
	const { productsArray, documentId } = await request.json();

	const { url, id } = await initialPayment(productsArray);

	console.log({url, id, documentId})

	const response = await fetch(`http://localhost:1337/api/orders/${documentId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: {
				order_id: id,
			}
		})
	});
	const responseData = await response.json();

	return json({ url }, { status: 201 });
}
