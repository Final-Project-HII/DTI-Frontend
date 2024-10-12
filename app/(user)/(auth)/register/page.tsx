import React from 'react'
import RegisterForm from './components/RegisterForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hiimart Store - Register to Access Fast & Easy Online Shopping",
  description: "Join Hiimart Store and create an account to access our wide range of products, exclusive deals, and fast delivery services.",
  keywords: ['register', 'create account', 'signup', 'Hiimart Store', 'online shopping'],
  openGraph: {
    title: "Register - Hiimart Store",
    description: "Join Hiimart Store and create an account to access our wide range of products, exclusive deals, and fast delivery services.",
    url: '/register',
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

const register = () => {
  return (
    <main className='mt-28'>
      <RegisterForm />
    </main>
  )
}

export default register