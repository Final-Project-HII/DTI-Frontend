import React from "react";
import AdminPaymentSimulation from "./Managepayment";
import { metadata as rootMetadata } from '@/app/layout';
import { Metadata } from "next";

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Admin Payment Simulation",
  description: "Simulate and manage payment processes effectively as an admin at Hiimart Store.",
  keywords: [...keywords, 'admin payment', 'payment simulation', 'Hiimart Store'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Admin Payment Simulation - Hiimart Store",
    description: "Simulate and manage payment processes effectively as an admin at Hiimart Store.",
    url: '/admin/payment-simulation',
  },
};
const page = () => {
  return <AdminPaymentSimulation />;
};

export default page