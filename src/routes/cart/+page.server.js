import { CMS_URL } from '$env/static/private';
import { initialPayment } from '$lib/yookassa.js';
import { json, redirect } from '@sveltejs/kit';

export const actions = {
    buy: async ({ request }) => {
        const formData = await request.formData();

        console.log(formData, 'formData')
        const productsArray = JSON.parse(formData.get('productsArray'));

        const response = await fetch('http://localhost:1337/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: productsArray
            })
        });
        const responseData = await response.json();

        console.log(responseData, 'responseData')
        
        const { url, id } = await initialPayment(productsArray);

        const documentId = responseData.data.documentId;

        await fetch(`${CMS_URL}/api/orders/${documentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    order_id: id
                }
            })
        });

        return redirect(303, url);
    }
};
