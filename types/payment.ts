export interface PaymentDetails {
    createdAt: string;
    amount: number;
    orderId: number;
    paymentMethod: 'PAYMENT_PROOF' | 'PAYMENT_GATEWAY';
    status: string;
    paymentProofUrl?: string;
  }