import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useSubscriptionStore } from '@/store/subscriptionStore';

// const stripePromise = loadStripe('your_publishable_key');

const plans = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Up to 5 clients',
      'Basic project management',
      'Simple invoicing',
    ],
    tier: 'free',
  },
  {
    name: 'Basic',
    price: 9.99,
    features: [
      'Up to 20 clients',
      'Advanced project tracking',
      'Custom invoice branding',
      'Basic reports',
    ],
    tier: 'basic',
  },
  {
    name: 'Pro',
    price: 19.99,
    features: [
      'Unlimited clients',
      'Team collaboration',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
    ],
    tier: 'pro',
  },
];

const BillingPage = () => {
  const { currentTier, isTrialing, trialEndsAt, startTrial } = useSubscriptionStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planTier: string) => {
    setIsLoading(true);
    try {
      // In a real application, you would:
      // 1. Call your backend to create a Stripe Checkout Session
      // 2. Redirect to Stripe Checkout
      // 3. Handle the success/cancel redirects
      console.log('Subscribing to', planTier);
      
      // Example of what the real implementation would look like:
      /*
      const stripe = await stripePromise;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planTier,
        }),
      });
      const session = await response.json();
      await stripe?.redirectToCheckout({
        sessionId: session.id,
      });
      */
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrial = () => {
    startTrial();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        {isTrialing && trialEndsAt && (
          <p className="text-muted-foreground">
            Trial ends on {new Date(trialEndsAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.tier} className={
            currentTier === plan.tier
              ? 'border-primary'
              : ''
          }>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                ${plan.price}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {currentTier === plan.tier ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={isLoading}
                >
                  {plan.tier === 'free' ? 'Start Free' : 'Subscribe'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {currentTier === 'free' && !isTrialing && (
        <Card>
          <CardHeader>
            <CardTitle>Try Pro Features Free</CardTitle>
            <CardDescription>
              Get 14 days of Pro features to see if it's right for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartTrial}>Start Free Trial</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingPage;
