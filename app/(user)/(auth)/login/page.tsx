import React from 'react'
import LoginForm from './components/LoginForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hiimart Store - Login to Your Account for Fast & Easy Shopping",
  description: "Login to Hiimart Store to enjoy fast shopping, track your orders, and discover exclusive deals tailored for you.",
  keywords: ['login', 'signin', 'Hiimart Store', 'online shopping'],
  openGraph: {
    title: "Login - Hiimart Store",
    description: "Login to Hiimart Store to enjoy fast shopping, track your orders, and discover exclusive deals tailored for you.",
    url: '/login',
    siteName: 'Hiimart Store',
    images: [
      {
        url: '/hiimart v0.png',
        width: 800,
        height: 600,
        alt: 'Login to Hiimart Store',
      },
    ],
    type: 'website',
  },
};
const login = () => {
  return (
    <main className='mt-28'>
      <LoginForm />
    </main>
  )
}

export default login