import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  totalBalance: number;
  verifiedBalance: number;
  pendingBalance: number;
  depositRewards: number;
  dailyRewards: number;
  referralRewards: number;
  addDepositReward: (amount: number, verified: boolean) => void;
  addDailyReward: (amount: number) => void;
  addReferralReward: (amount: number) => void;
  verifyDeposit: (amount: number) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      totalBalance: 0,
      verifiedBalance: 0,
      pendingBalance: 0,
      depositRewards: 0,
      dailyRewards: 0,
      referralRewards: 0,

      addDepositReward: (amount, verified) =>
        set((state) => {
          const reward = calculateDepositReward(amount);
          if (verified) {
            return {
              totalBalance: state.totalBalance + reward,
              verifiedBalance: state.verifiedBalance + reward,
              depositRewards: state.depositRewards + reward,
            };
          } else {
            return {
              totalBalance: state.totalBalance + reward,
              pendingBalance: state.pendingBalance + reward,
              depositRewards: state.depositRewards + reward,
            };
          }
        }),

      addDailyReward: (amount) =>
        set((state) => ({
          totalBalance: state.totalBalance + amount,
          verifiedBalance: state.verifiedBalance + amount,
          dailyRewards: state.dailyRewards + amount,
        })),

      addReferralReward: (amount) =>
        set((state) => ({
          totalBalance: state.totalBalance + amount,
          verifiedBalance: state.verifiedBalance + amount,
          referralRewards: state.referralRewards + amount,
        })),

      verifyDeposit: (amount) =>
        set((state) => ({
          pendingBalance: Math.max(0, state.pendingBalance - amount),
          verifiedBalance: state.verifiedBalance + amount,
        })),

      reset: () =>
        set({
          totalBalance: 0,
          verifiedBalance: 0,
          pendingBalance: 0,
          depositRewards: 0,
          dailyRewards: 0,
          referralRewards: 0,
        }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);

function calculateDepositReward(amount: number): number {
  if (amount === 100) return 3;
  if (amount === 200) return 6;
  if (amount === 300) return 20;
  if (amount === 400) return 40;
  if (amount >= 500 && amount <= 1000) return amount * 0.04;
  if (amount > 1000 && amount <= 90000) return amount * 0.03;
  return 0;
}
