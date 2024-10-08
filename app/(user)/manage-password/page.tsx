import React from 'react'
import ManagePasswordForm from './components/ManagePasswordForm'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiimart Store - Manage Your Password",
  description: "Update and manage your password securely at Hiimart Store. Ensure your account remains safe and secure.",
  keywords: ['manage password', 'update password', 'Hiimart Store', 'account security'],
  openGraph: {
    title: "Manage Password - Hiimart Store",
    description: "Update and manage your password securely at Hiimart Store. Ensure your account remains safe and secure.",
    url: '/manage-password',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Manage Password at Hiimart Store',
      },
    ],
    type: 'website',
  },
};


const managePassword = () => {
  return (
    <ManagePasswordForm />
  )
}

export default managePassword