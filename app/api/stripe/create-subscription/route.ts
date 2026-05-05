import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await request.json();
    const plan = body?.plan === 'basic' ? 'basic' : 'premium';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const paymentMethodId = typeof body?.paymentMethodId === 'string' ? body.paymentMethodId : '';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    const yearlyPriceId =
      process.env.STRIPE_PRICE_YEARLY ??
      process.env.STRIPE_YEARLY_PRICE_ID ??
      process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;
    const monthlyPriceId =
      process.env.STRIPE_PRICE_MONTHLY ??
      process.env.STRIPE_MONTHLY_PRICE_ID ??
      process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
    const priceId = plan === 'premium' ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      return NextResponse.json({ error: 'Missing Stripe Price ID configuration' }, { status: 500 });
    }

    const isValidPriceId = /^price_[A-Za-z0-9]+$/.test(priceId);

    if (!isValidPriceId) {
      return NextResponse.json(
        {
          error:
            'Stripe price configuration is invalid. Use a real Stripe Price ID (e.g. price_1ABC...), not a placeholder like price_ or a numeric amount.',
        },
        { status: 500 }
      );
    }

    const customer = await stripe.customers.create({
      email,
    });

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      trial_period_days: plan === 'premium' ? 7 : undefined,
      expand: ['latest_invoice.payment_intent'],
    });

    const latestInvoice =
      subscription.latest_invoice && typeof subscription.latest_invoice !== 'string'
        ? subscription.latest_invoice
        : null;
    const invoiceWithPaymentIntent = latestInvoice as
      | (Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent | string | null })
      | null;
    const paymentIntent =
      invoiceWithPaymentIntent?.payment_intent &&
      typeof invoiceWithPaymentIntent.payment_intent !== 'string'
        ? invoiceWithPaymentIntent.payment_intent
        : null;

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: paymentIntent?.client_secret ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create subscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
