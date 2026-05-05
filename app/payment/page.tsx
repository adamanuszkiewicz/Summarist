'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
// import convertToSubcurrency from '@/lib/convertToSubcurrenamount"
type PlanType = 'premium' | 'basic';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#032b41',
      '::placeholder': {
        color: '#6b757b',
      },
    },
    invalid: {
      color: '#c0392b',
    },
  },
};

const CheckoutForm = ({ selectedPlan }: { selectedPlan: PlanType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage('Card input is not ready yet.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const paymentMethodResult = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email,
        },
      });

      if (paymentMethodResult.error || !paymentMethodResult.paymentMethod) {
        throw new Error(paymentMethodResult.error?.message ?? 'Unable to create payment method');
      }

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          email,
          paymentMethodId: paymentMethodResult.paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to create subscription');
      }

      if (data.clientSecret) {
        const confirmation = await stripe.confirmCardPayment(data.clientSecret);

        if (confirmation.error) {
          throw new Error(confirmation.error.message ?? 'Payment confirmation failed');
        }
      }

      router.push(`/payment/success?subscription_id=${data.subscriptionId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete payment';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
      <div className="plan__card plan__card--active" style={{ cursor: 'default' }}>
        <div className="plan__card--content" style={{ width: '100%' }}>
          <div className="plan__card--text" style={{ marginBottom: '8px', fontWeight: 700 }}>
            Email address
          </div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="login__input"
            required
          />
          <div className="plan__card--text" style={{ margin: '16px 0 8px', fontWeight: 700 }}>
            Card details
          </div>
          <div
            style={{
              border: '2px solid #e1e7ea',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#fff',
            }}
          >
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      </div>

        <span className="btn__wrapper">
          <button className="plan__btn payment__submit--btn" type="submit" disabled={isLoading || !stripe}>
            <span>{isLoading ? 'Processing payment...' : 'Pay now'}</span>
          </button>
        </span>
        <div className="plan__disclaimer">Your payment details are securely processed by Stripe.</div>
        <div
          className="plan__disclaimer"
          style={{ color: '#c0392b', minHeight: '20px', marginTop: '6px' }}
          aria-live="polite"
        >
          {errorMessage ?? ''}
        </div>
    </form>
  );
};

const PaymentContent = () => {
  const searchParams = useSearchParams();
  const selectedPlan = (searchParams.get('plan') === 'basic' ? 'basic' : 'premium') as PlanType;
  const isStripeConfigured = Boolean(stripePublishableKey);

  const planDetails = useMemo(() => {
    if (selectedPlan === 'premium') {
      return {
        title: 'Premium Plus Yearly',
        amount: '$99.99/year',
        note: 'Includes a 7-day free trial',
      };
    }

    return {
      title: 'Premium Monthly',
      amount: '$9.99/month',
      note: 'Billed monthly, cancel anytime',
    };
  }, [selectedPlan]);

  return (
    <div className="payment__container">
      <div className="payment__row">
        <div className="plan__container">
          <div className="section__title">Complete your payment</div>
          <div className="plan__card plan__card--active" style={{ cursor: 'default' }}>
            <div className="plan__card--content">
              <div className="plan__card--title">{planDetails.title}</div>
              <div className="plan__card--price">{planDetails.amount}</div>
              <div className="plan__card--text">{planDetails.note}</div>
            </div>
          </div>

          {isStripeConfigured ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm selectedPlan={selectedPlan} />
            </Elements>
          ) : (
            <div className="plan__card plan__card--active" style={{ cursor: 'default', marginTop: '24px' }}>
              <div className="plan__card--content">
                <div className="plan__card--title">Checkout unavailable</div>
                <div className="plan__card--text">
                  Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Add it in Vercel environment variables, then redeploy.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentContent />
    </Suspense>
  );
};

export default PaymentPage;
