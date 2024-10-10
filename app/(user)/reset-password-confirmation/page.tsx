import React from 'react'
import ResetPasswordConfirmationForm from './components/ResetPasswordConfirmationForm'
import { metadata as rootMetadata } from '@/app/layout';
import { Metadata } from 'next';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - Reset Password Confirmation",
  description: "Your password has been reset successfully. You can now log in with your new password.",
  keywords: [...keywords, 'reset password confirmation', 'Hiimart Store', 'account security'],
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Reset Password Confirmation - Hiimart Store",
    description: "Your password has been reset successfully. Log in to your account now.",
    url: '/reset-password-confirmation',
  },
};


const resetPasswordConfirmation = () => {
  return (
    <ResetPasswordConfirmationForm />
  )
}

export default resetPasswordConfirmation