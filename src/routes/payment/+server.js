import { json } from '@sveltejs/kit';
import { confirmPayment } from '$lib/yookassa.js'; // функции для работы с API ЮKassa

// Обработчик вебхука для приема запросов от YooKassa
export async function POST({ request }) {
    const body = await request.json();

    console.log(body, 'body webhook')
    // Проверка, что пришло нужное событие от YooKassa  
    if (body.event === 'payment.waiting_for_capture') {
        const order_id = body.object.id;
        const status = body.object.status;

        if (status === 'waiting_for_capture') {
            try {
                await confirmPayment(order_id);
                return json({ message: 'Payment confirmed and processed' }, { status: 200 });
            } catch (error) {
                console.error('Error processing payment:', error);
                return json({ error: 'Error processing payment' }, { status: 500 });
            }
        }
    }

    return json({ message: 'Webhook received' }, { status: 200 });
}

