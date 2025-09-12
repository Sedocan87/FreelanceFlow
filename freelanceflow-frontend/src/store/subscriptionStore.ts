import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'basic' | 'pro';

interface SubscriptionState {
  currentTier: SubscriptionTier;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  subscriptionEndsAt: Date | null;
  updateSubscription: (tier: SubscriptionTier) => void;
  startTrial: () => void;
  endTrial: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      currentTier: 'free',
      isTrialing: false,
      trialEndsAt: null,
      subscriptionEndsAt: null,
      updateSubscription: (tier) => set({ currentTier: tier }),
      startTrial: () => set({
        isTrialing: true,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      }),
      endTrial: () => set({
        isTrialing: false,
        trialEndsAt: null,
      }),
    }),
    {
      name: 'subscription-storage',
    }
  )
);
