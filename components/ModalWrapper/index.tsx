// components/ModalWrapper.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Modal from '../Modal';

interface ModalInfo {
  title: string;
  description: string;
  redirectTo: string;
}

export const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null)

  useEffect(() => {
    const modalInfoParam = searchParams.get('modalInfo')

    if (modalInfoParam) {
      try {
        const parsedModalInfo: ModalInfo = JSON.parse(modalInfoParam)
        setModalInfo(parsedModalInfo)
        setShowModal(true)

        // Set a timer for automatic redirect
        const timer = setTimeout(() => {
          handleCloseModal()
        }, 4000)

        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Error parsing modalInfo:', error)
      }
    } else {
      // If there's no modalInfo in the URL, close the modal
      setShowModal(false)
      setModalInfo(null)
    }
  }, [searchParams])

  const handleCloseModal = () => {
    setShowModal(false)
    setModalInfo(null)
    
    // Remove the modalInfo parameter from the URL
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete('modalInfo')
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`)
  }

  return (
    <>
      {showModal && modalInfo && (
        <Modal 
          title={modalInfo.title} 
          description={modalInfo.description} 
          onClose={handleCloseModal}
        />
      )}
      {children}
    </>
  )
}

export default ModalWrapper
