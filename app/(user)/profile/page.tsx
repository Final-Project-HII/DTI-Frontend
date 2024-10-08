import React from 'react'
import ProfilePage from './components/ProfilePage'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hiimart Store - User Profile",
  description: "Manage your account and personal information on Hiimart Store. Update your preferences and settings.",
  keywords: ['user profile', 'account settings', 'Hiimart Store', 'profile management'],
  openGraph: {
    title: "User Profile - Hiimart Store",
    description: "Manage your account and personal information on Hiimart Store.",
    url: '/profile',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'User Profile at Hiimart Store',
      },
    ],
    type: 'website',
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