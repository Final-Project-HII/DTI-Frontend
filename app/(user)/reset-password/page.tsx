import React from 'react'
import ResetPasswordForm from './components/ResetPasswordForm'
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Reset Your Password",
  description: "Reset your password securely at Hiimart Store. Ensure your account remains safe and accessible.",
  keywords: [...keywords, 'reset password', 'password recovery', 'Hiimart Store', 'account security'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Reset Password - Hiimart Store",
    description: "Securely reset your password to keep your account safe on Hiimart Store.",
    url: '/reset-password',
  },
};

const resetPassword = () => {
  return (
    <ResetPasswordForm />
  )
}

export default resetPassword