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

		// Await the response from the fetch call
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(params)
		});

		// Handle HTTP error response
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		// Parse the response JSON
		const res = await response.json();

		// Return the URL and order ID as an object
		return {
			url: res.confirmation.confirmation_url,
			id: res.id
		};
	} catch (err) {
		console.warn('ERROR', err);

		// Throw a custom error
		throw new Error(400, 'error');
	}
};

export const confirmPayment = async (order_id) => {
	try {
		// Step 1: Update order status in the CMS to "paid"
		const responseOrder = await fetch(`${CMS_URL}/api/orders?filters[order_id][$eq]=${order_id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				data: {
					order_status: 'paid'
				}
			})
		});

		if (!responseOrder.ok) {
			throw new Error('Failed to update order status in CMS');
		}

		const responseOrderData = await responseOrder.json();
		console.log('Order status updated:', responseOrderData);

		// Step 2: Confirm the payment in YooKassa (Capture the payment)
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

/* 
exports.UkassaWebHook = functions.https.onRequest(async (request, response) => {
	if (request.body.event == 'payment.waiting_for_capture') {
		let payment_id = request.body.object.id;
		let status = request.body.object.status;
		if (status == 'waiting_for_capture') {
			// сюда попадаем, если клиент оплатил
			await confirmPayment(payment_id);
			await getPayment(payment_id);
		}
	}
	response.send('OK');
});

const confirmPayment = async (payment_id) => {
	await admin
		.firestore()
		.collection('orders')
		.where('payment_id', '==', payment_id)
		.limit(1)
		.get()
		.then((snapshot) => {
			if (snapshot.size > 0) {
				const firstDoc = snapshot.docs[0].ref;
				firstDoc
					.update({ paid: true })
					.then(() => {
						console.log('Документ успешно обновлен');
					})
					.catch((err) => {
						console.log('Ошибка обновления документа', err);
					});
			} else {
				console.log('документы не найдены');
			}
		})
		.catch((err) => {
			console.log('Ошибка получения документа', err);
			return null;
		});
};

const getPayment = async (payment_id) => {
	const url = `https://api.yookassa.ru/v3/payments/${payment_id}/capture`;

	var headers = {
		Authorization: authorization,
		'Idempotence-Key': uuidv4().toString(),
		'Content-Type': 'application/json'
	};

	return await axios
		.post(
			url,
			{},
			{
				headers: headers
			}
		)
		.then((res) => res.data)
		.then(async (res) => {
			functions.logger.log('Платеж успешно подтвержден', res);
			return true;
		})
		.catch((err) => {
			functions.logger.log('Ошибка при подтверждении платежа', err);
			return false;
		});
};

const cancelPayemnt = async (payment_id) => {
	const url = `https://api.yookassa.ru/v3/payments/${payment_id}/cancel`;

	var headers = {
		Authorization: authorization,
		'Idempotence-Key': uuidv4().toString(),
		'Content-Type': 'application/json'
	};

	return await axios
		.post(
			url,
			{},
			{
				headers: headers
			}
		)
		.then((res) => res.data)
		.then(async (res) => {
			functions.logger.log('Платеж успешно отменен', res);
			return true;
		})
		.catch((err) => {
			functions.logger.log('Ошибка при отмене платежа', err);
			return false;
		});
};

exports.getPaymentApi = functions.https.onRequest(async (request, response) => {
	var payment_id = request.body.payment_id;
	await getPayment(payment_id);
	response.status(200);
});

exports.cancelPaymentApi = functions.https.onRequest(async (request, response) => {
	var payment_id = request.body.payment_id;
	await cancelPayemnt(payment_id);
	response.status(200);
});
 */
