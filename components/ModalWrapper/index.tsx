'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthModal from '../AuthModal';

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

        const timer = setTimeout(() => {
          setShowModal(false)
          router.push(parsedModalInfo.redirectTo)
        }, 3000)

        return () => clearTimeout(timer)
      } catch (error) {
        console.error('Error parsing modalInfo:', error)
      }
    }
  }, [searchParams, router])

  return (
    <>
      {showModal && modalInfo && (
        <AuthModal title={modalInfo.title} description={modalInfo.description} />
      )}
      {children}
    </>
  )
}

export default ModalWrapper
