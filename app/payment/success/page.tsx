'use client';

import Link from 'next/link';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="success__container">
      <div className="success__row">
        <div className="section__title">Payment Successful</div>
        <div className="plan__card plan__card--active" style={{ cursor: 'default' }}>
          <div className="plan__card--content">
            <div className="plan__card--title">Welcome to Premium</div>
            <div className="plan__card--text">Your subscription is active and your access is ready.</div>
            {sessionId && (
              <div className="plan__card--text" style={{ marginTop: '8px', wordBreak: 'break-all' }}>
                Session ID: {sessionId}
              </div>
            )}
          </div>
        </div>
        <div className="btn__wrapper">
          <Link href="/forYou" className="plan__btn">
            <span>For You!</span>
          </Link>
        </div>
          <div className="plan__disclaimer">Need help? Contact support from Settings at any time.</div>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
