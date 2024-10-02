import SendNewVerificationLink from '@/hooks/SendNewVerificationLink';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Modal from './Modal';



type LoginRequestLinkModal = {
  email: string | null;
  title: string;
  description: string;
  closeModal: () => void;
  reset: () => void;
};
const GenereteNewVerificationModalLogin: React.FC<LoginRequestLinkModal> = ({ email, title, description, closeModal, reset }) => {
  const { AddNewVerificationLink, isLoading } = SendNewVerificationLink();
  const [showNewVerificationLinkModal, setShowNewVerificationLinkModal] = useState(false);



  const handleNewLink = async () => {
    try {
      await AddNewVerificationLink(email);
      setShowNewVerificationLinkModal(true);
      setTimeout(() => {
        setShowNewVerificationLinkModal(false);
        closeModal()
        reset()
      }, 6000);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-20 p-5">
      <div className="bg-white p-5 lg:p-10 rounded-md shadow-md flex flex-col gap-3 sm:max-w-[600px] text-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">{description} <span className='font-bold'>{email}</span></p>
        <div className="button flex gap-4 justify-center text-sm">
          <button
            onClick={closeModal}
            className=" hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4  rounded "
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded shadow-md"
            disabled={isLoading} onClick={handleNewLink}
          >
            {isLoading ? "Loading ... " : "Request New Link"}
          </button>
        </div>
      </div>
      {showNewVerificationLinkModal && (
        <Modal title="Verification Link Sent!" description="A new verification link has been sent to your email. Please check your latest inbox to verify your account." />
      )}
    </div>
  );
}

export default GenereteNewVerificationModalLogin