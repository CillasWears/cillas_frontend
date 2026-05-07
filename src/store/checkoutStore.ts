import { create } from 'zustand';
import type { Address } from '../types';

type CheckoutStep = 'shipping' | 'payment' | 'confirm';

interface CheckoutStore {
 step: CheckoutStep;
 selectedAddressId: string | null;
 orderId: string | null;
 paymentReference: string | null;
 setStep: (step: CheckoutStep) => void;
 setSelectedAddressId: (id: string) => void;
 setOrderId: (id: string) => void;
 setPaymentReference: (ref: string) => void;
 reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
 step: 'shipping',
 selectedAddressId: null,
 orderId: null,
 paymentReference: null,
 setStep: (step) => set({ step }),
 setSelectedAddressId: (id) => set({ selectedAddressId: id }),
 setOrderId: (id) => set({ orderId: id }),
 setPaymentReference: (ref) => set({ paymentReference: ref }),
 reset: () =>
  set({
   step: 'shipping',
   selectedAddressId: null,
   orderId: null,
   paymentReference: null,
  }),
}));