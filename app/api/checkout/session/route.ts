import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any }) 
  : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!stripe) {
      // PROTOTYPE MODE: Fallback simulation
      console.log('Stripe Sandbox Session: Operating in Prototype/Mockup mode.');
      return NextResponse.json({
        prototype: true,
        message: "Stripe sandbox is active. Backend router is fully compiled and pre-wired for your API keys.",
        url: "/checkout/success?prototype=true"
      });
    }

    // PRODUCTION MODE: Real checkout session creation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price, // Stored in smallest denomination (paise)
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout?cancelled=true`,
      customer_email: customerEmail,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout API error:', err);
    return NextResponse.json({ error: err.message || 'Server error compiling payment session' }, { status: 500 });
  }
}
