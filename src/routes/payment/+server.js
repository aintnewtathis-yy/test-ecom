import { json } from '@sveltejs/kit';
import { confirmPayment, cancelPayment } from '$lib/yookassa.js'; 

export async function POST({ request }) {
    const body = await request.json();

    console.log(body, 'body webhook')

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
        } else {
            try {
                await declinePayment(order_id);
                return json({ message: 'Payment cancelled' }, { status: 200 });
            } catch (error) {
                console.error('Error processing payment:', error);
                return json({ error: 'Error processing payment' }, { status: 500 });
            }
        }
    } 

    return json({ message: 'Webhook received' }, { status: 200 });
}

