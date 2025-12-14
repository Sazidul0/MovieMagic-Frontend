import React, { useEffect, useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createStripePayment, verifyStripePayment } from '../services/api';

// Shared style for all card fields
const CARD_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      '::placeholder': {
        color: '#94a3b8',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

// Updated CheckoutForm with separate fields
function CheckoutForm({ clientSecret, paymentId, onSuccess, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) {
      setError('Card details are incomplete.');
      setLoading(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
        },
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

      // Verify with your backend
      const verifyRes = await verifyStripePayment({
        paymentId,
        stripePaymentIntentId: intent.id,
      });

      if (verifyRes.payment && verifyRes.payment.status === 'success') {
        if (onSuccess) onSuccess(verifyRes.payment);
      } else {
        setError(verifyRes.status || 'Payment could not be verified');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Card Number
        </label>
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:border-cyan-400 transition-all duration-200">
          <CardNumberElement options={CARD_OPTIONS} />
        </div>
      </div>

      {/* Expiry and CVC - Side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Expiry Date
          </label>
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:border-cyan-400 transition-all duration-200">
            <CardExpiryElement options={CARD_OPTIONS} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            CVC
          </label>
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:border-cyan-400 transition-all duration-200">
            <CardCvcElement options={CARD_OPTIONS} />
          </div>
        </div>
      </div>

      {/* Confirm Payment Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-bold rounded-xl shadow-lg hover:from-emerald-300 hover:to-emerald-500 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
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

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  useEffect(() => {
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      handleCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div className="relative overflow-hidden bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-600/10 pointer-events-none rounded-3xl"></div>

      <div className="relative z-10">
        <h4 className="text-2xl font-bold text-white mb-2">
          Stripe Payment <span className="text-sm font-normal text-cyan-300">(Test Mode)</span>
        </h4>

        <div className="flex items-baseline gap-2 mb-6">
          <p className="text-gray-300">Amount:</p>
          <span className="text-3xl font-bold text-yellow-400">${amount}</span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {!clientSecret ? (
          <div className="space-y-4">
            <button
              onClick={handleCreate}
              disabled={loadingCreate}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-bold rounded-xl shadow-lg hover:from-cyan-300 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loadingCreate ? 'Creating Payment Intent...' : 'Create Payment'}
            </button>

            {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
              <p className="text-xs text-gray-400 text-center">
                (Server must return publishableKey or set VITE_STRIPE_PUBLISHABLE_KEY)
              </p>
            )}
          </div>
        ) : stripePromise ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              clientSecret={clientSecret}
              paymentId={paymentId}
              onSuccess={onSuccess}
              amount={amount}
            />
          </Elements>
        ) : (
          <div className="text-center text-gray-400">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              Initializing Stripe...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripePayment;