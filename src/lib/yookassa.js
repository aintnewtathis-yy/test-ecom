import { API_YOOKASSA_URL } from '$env/static/private';
import { CMS_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
const authorization = `Basic ${API_YOOKASSA_URL}`;
const initial_payment_msg = 'Списываем оплату за заказ';
const my_url = '/success';

export const initialPayment = async (productsData) => {
	try {
		const url = 'https://api.yookassa.ru/v3/payments';

		// получаем заказ из БД и цену заказа
		const order_id = productsData.order_id;
		const price = productsData.total;

		// параметры для запроса
		const headers = {
			Authorization: authorization,
			'Idempotence-Key': crypto.randomUUID(),
			'Content-Type': 'application/json'
		};
		const params = {
			amount: {
				value: price.toString(),
				currency: 'RUB'
			},
			payment_method_data: {
				type: 'bank_card'
			},
			confirmation: {
				type: 'redirect',
				return_url: my_url
			},
			description: initial_payment_msg,
			save_payment_method: 'false'
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(params)
		});

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const res = await response.json();

		return {
			url: res.confirmation.confirmation_url,
			id: res.id
		};
	} catch (err) {
		console.warn('ERROR', err);

		throw error(400, {
			message: 'Error in making order',
			details: err.message
		});
	}
};

export const confirmPayment = async (order_id) => {
	console.log(order_id);
	try {
		const responseOrder = await fetch(`${CMS_URL}/api/orders/updateOrderStatus`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				data: {
					order_id: order_id,
					order_status: 'paid'
				}
			})
		});

		if (!responseOrder.ok) {
			throw new Error('Failed to update order status in CMS');
		}

		const responseOrderData = await responseOrder.json();
		console.log('Order status updated:', responseOrderData);

		const responsePayment = await fetch(`https://api.yookassa.ru/v3/payments/${order_id}/capture`, {
			method: 'POST',
			headers: {
				Authorization: authorization,
				'Idempotence-Key': crypto.randomUUID(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});

		if (!responsePayment.ok) {
			throw new Error('Failed to confirm payment in YooKassa');
		}

		const responsePaymentData = await responsePayment.json();
		console.log('Payment confirmed:', responsePaymentData);

		return {
			message: 'Payment confirmed and order status updated',
			order: responseOrderData,
			payment: responsePaymentData
		};
	} catch (err) {
		console.warn(`Error confirming payment: ${err.message}`);
		throw error(400, {
			message: 'Error in confirming payment',
			details: err.message
		});
	}
};

export const cancelPayment = async (order_id) => {
	console.log(order_id);
	try {
		const responseOrder = await fetch(`${CMS_URL}/api/orders/updateOrderStatus`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				order_id: order_id,
				order_status: 'cancelled'
			})
		});

		if (!responseOrder.ok) {
			throw new Error('Failed to update order status in CMS');
		}

		const responseOrderData = await responseOrder.json();
		console.log('Order status updated:', responseOrderData);

		const responsePayment = await fetch(`https://api.yookassa.ru/v3/payments/${order_id}/cancel`, {
			method: 'POST',
			headers: {
				Authorization: authorization,
				'Idempotence-Key': crypto.randomUUID(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});

		if (!responsePayment.ok) {
			throw new Error('Failed to confirm payment in YooKassa');
		}

		const responsePaymentData = await responsePayment.json();
		console.log('Payment cancelled:', responsePaymentData);

		return {
			message: 'Payment cancelled',
			order: responseOrderData,
			payment: responsePaymentData
		};
	} catch (err) {
		console.warn(`Error confirming payment: ${err.message}`);
		throw error(400, {
			message: 'Error in confirming payment',
			details: err.message
		});
	}
};
