import React from 'react'
import ProfilePage from './components/ProfilePage'
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/app/layout';

const keywords = Array.isArray(rootMetadata.keywords) ? rootMetadata.keywords : [];

export const metadata: Metadata = {
  ...rootMetadata,
  title: "Hiimart Store - User Profile",
  description: "Manage your account and personal information on Hiimart Store. Update your preferences and settings.",
  keywords: [...keywords, 'user profile', 'account settings', 'Hiimart Store', 'profile management'], // Combine root keywords with page-specific ones
  openGraph: {
    ...rootMetadata.openGraph,
    title: "User Profile - Hiimart Store",
    description: "Manage your account and personal information on Hiimart Store.",
    url: '/profile',
  },
};

const profile = () => {
  return (
    <div className="mt-24">
      <ProfilePage />
    </div>
  )
}

export default profile