export interface PaymentDetails {
    paymentProofUrl: string | undefined;
    createdAt: string;
    amount: number;
    orderId: number;
    paymentMethod: 'PAYMENT_PROOF' | 'PAYMENT_GATEWAY';
    status?: string;
    proofImageUrl?: string;
    va_numbers?: { bank: string; va_number: string }[];
  }

  export interface PaymentStatus {
    createdAt: string;
    amount: number;
    orderId: string;
    paymentMethod: string;
    status: string;
    paymentProofUrl?: string;
    expirationTime?: string;
  }