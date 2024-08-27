import SendNewVerificationLink from '@/hooks/SendNewVerificationLink';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Modal from './Modal';

type GenerateNewVerificationModalProps = {
  email: string | null;
  title: string;
  description: string
};
const GenerateNewVerificationModal: React.FC<GenerateNewVerificationModalProps> = ({ email, title, description }) => {
  const { AddNewVerificationLink, isLoading } = SendNewVerificationLink();
  const [showNewVerificationLinkModal, setShowNewVerificationLinkModal] = useState(false);
  const router = useRouter();

  const handleNewLink = async () => {
    try {
      const result = await AddNewVerificationLink(email);
      if (result) {
        setShowNewVerificationLinkModal(true);
        setTimeout(() => {
          router.push('/login');
        }, 6000);
      }
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
      {showNewVerificationLinkModal && <Modal title='Verification Link Sent!' description=' A verification link has already send to your email. Please check your latest inbox to verify your account.' />}
    </>
  );
}

export default GenerateNewVerificationModal