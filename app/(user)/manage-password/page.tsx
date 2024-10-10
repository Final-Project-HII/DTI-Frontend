import React from 'react'
import ManagePasswordForm from './components/ManagePasswordForm'
import { Metadata } from "next";
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Manage Your Password",
  description: "Update and manage your password securely at Hiimart Store. Ensure your account remains safe and secure.",
  keywords: [...keywords, 'manage password', 'update password', 'account security'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Manage Password - Hiimart Store",
    description: "Update and manage your password securely at Hiimart Store. Ensure your account remains safe and secure.",
    url: '/manage-password',
  },
};


const managePassword = () => {
  return (
    <ManagePasswordForm />
  )
}

export default managePassword