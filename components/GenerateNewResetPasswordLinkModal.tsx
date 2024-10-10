import SendNewResetPasswordLink from '@/hooks/SendNewResetPasswordLink';

import React, { useState } from 'react'
import Modal from './Modal';
import { useRouter } from 'next/navigation';


type GenerateNewResetPasswordLinkModalProps = {
  email: string | null;
  title: string;
  description: string
};


const GenerateNewResetPasswordLinkModal: React.FC<GenerateNewResetPasswordLinkModalProps> = ({ email, title, description }) => {
  const { AddNewResetPasswordLink, isLoading } = SendNewResetPasswordLink();
  const [showNewResetPasswordModal, setShowNewResetPasswordModal] = useState(false);
  const router = useRouter();

  const handleNewLink = async () => {
    try {
      await AddNewResetPasswordLink(email);
      setShowNewResetPasswordModal(true);
      setTimeout(() => {
        router.push('/login');
      }, 6000);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="w-4/5 max-w-[425px] bg-white p-6 rounded-lg shadow-md lg:w-full text-center">
        <h1 className='text-2xl font-bold text-red-500'>{title}</h1>
        <p className='text-sm text-gray-500 mt-4'>{description}</p>
        <button disabled={isLoading} onClick={handleNewLink} className="mt-6 py-2 px-4 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 inline-block">
          {isLoading ? "Loading ... " : "Request New Link"}
        </button>
      </div>
      {showNewResetPasswordModal && <Modal title='Reset Password Link Sent!' description='A reset password link has been sent to your email. Please check your inbox to reset your account password.' />}
    </>
  );
}

export default GenerateNewResetPasswordLinkModal