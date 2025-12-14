import React, { useEffect, useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createStripePayment, verifyStripePayment } from '../services/api';

// Inner checkout form that confirms payment using clientSecret
function CheckoutForm({ clientSecret, paymentId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    try {
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setLoading(false);
        return;
      }

      const intent = result.paymentIntent;
      if (!intent) {
        setError('No payment intent returned');
        setLoading(false);
        return;
      }

      // Inform backend to verify / sync
      const verifyRes = await verifyStripePayment({ paymentId, stripePaymentIntentId: intent.id });

      if (verifyRes.payment && verifyRes.payment.status === 'success') {
        if (onSuccess) onSuccess(verifyRes.payment);
      } else if (verifyRes.status) {
        setError(`Payment status: ${verifyRes.status}`);
      }
    } catch (err) {
      setError(err.message || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-400">{error}</div>}
      <div className="p-3 bg-black/50 rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-emerald-500 text-black rounded font-semibold"
      >
        {loading ? 'Processing...' : 'Confirm Payment'}
      </button>
    </form>
  );
}

const StripePayment = ({ amount, currency = 'usd', onSuccess }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [publishableKey, setPublishableKey] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [error, setError] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Create PaymentIntent on button click
  const handleCreate = async () => {
    try {
      setLoadingCreate(true);
      setError('');
      const res = await createStripePayment({ amount, currency, meta: { source: 'cart' } });
      setClientSecret(res.clientSecret);
      setPaymentId(res.paymentId);
      setPublishableKey(res.publishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    } catch (err) {
      setError(err.message || 'Failed to create payment');
    } finally {
      setLoadingCreate(false);
    }
  };

  // Initialize stripePromise whenever publishableKey becomes available
  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  // Start create automatically if VITE_STRIPE_PUBLISHABLE_KEY is present
  useEffect(() => {
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      // create automatically so we can mount Elements
      handleCreate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize options for Elements
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h4 className="text-xl font-semibold mb-3">Stripe (Test Mode) Payment</h4>
      <p className="text-sm text-gray-300 mb-4">Amount: <span className="font-bold text-yellow-400">${amount}</span></p>

      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

      {!clientSecret ? (
        <div className="flex gap-2">
          <button onClick={handleCreate} disabled={loadingCreate} className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded">
            {loadingCreate ? 'Creating...' : 'Create Payment'}
          </button>
          {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
            <div className="text-sm text-gray-400 self-center">(Server must return publishableKey or set VITE_STRIPE_PUBLISHABLE_KEY)</div>
          )}
        </div>
      ) : (
        stripePromise ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm clientSecret={clientSecret} paymentId={paymentId} onSuccess={onSuccess} />
          </Elements>
        ) : (
          <div className="text-sm text-gray-400">Initializing Stripe...</div>
        )
      )}
    </div>
  );
};

export default StripePayment;
