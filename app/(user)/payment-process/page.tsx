import PaymentProcessPage from "./components/ProcessPage";
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Payment Process",
  description: "Continue your payment process securely at Hiimart Store. Ensure a smooth and safe transaction experience.",
  keywords: [...keywords, 'payment process', 'checkout', 'Hiimart Store', 'secure transaction'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Payment Process - Hiimart Store",
    description: "Proceed with your payment process at Hiimart Store, ensuring a secure transaction.",
    url: '/payment-process',
  },
};

export default function PaymentProcess() {
  return <PaymentProcessPage />;
}
