import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import type Evento from '../models/Evento';
import EventService from '../services/event.services';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ evento, quantity, email, onSuccess }: { 
  evento: Evento, 
  quantity: number, 
  email: string,
  onSuccess: () => void 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: (evento.price || 10) * quantity,
          email,
          quantity,
          eventId: evento.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'An error occurred');
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-[#d93823] text-white py-2 px-4 rounded-lg hover:bg-[#b32d1c] transition-colors duration-200 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default function TicketPurchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      EventService.getById(Number(id))
        .then((data) => {
          setEvento(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 5) {
      setQuantity(value);
    }
  };

  const handlePaymentSuccess = () => {
    alert('Your payment was successful! The tickets will be sent to your email.');
    
    navigate('/events');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!evento) return <div>Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Buy Tickets - {evento.ciudad}</h1>
        
        <div className="mb-6">
          <img 
            src={evento.frontImage.startsWith('http') ? evento.frontImage : `/${evento.frontImage}`} 
            alt={`Event ${evento.ciudad}`} 
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/src/assets/carteles/Cartel_Evento_01.jpg';
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of tickets</label>
            <div className="mt-1 flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-1 border rounded-l"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="5"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-16 text-center border-t border-b"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 border rounded-r"
                disabled={quantity >= 5}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="tickets@example.com"
              required
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Price per ticket:</span>
              <span>€{evento.price || 10}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>€{(evento.price || 10) * quantity}</span>
            </div>
          </div>

          {email && (
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                evento={evento}
                quantity={quantity}
                email={email}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
} 