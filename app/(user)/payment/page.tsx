import PaymentPage from "./components/PaymentPage";
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Payment Page",
  description: "Securely process your payments at Hiimart Store. Experience fast and easy transactions.",
  keywords: [...keywords, 'payment', 'checkout', 'Hiimart Store', 'secure payment'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Payment - Hiimart Store",
    description: "Manage your payment securely and efficiently at Hiimart Store.",
    url: '/payment',
  },
};

export default function Payment() {
  return <PaymentPage />;
}
