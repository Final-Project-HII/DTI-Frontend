'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Modal from '../Modal';

interface ModalInfo {
  title: string;
  description: string;
  redirectTo: string;
}

export const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null)

  useEffect(() => {
    const modalInfoParam = searchParams.get('modalInfo')

    if (modalInfoParam) {
      try {
        const parsedModalInfo: ModalInfo = JSON.parse(modalInfoParam)
        setModalInfo(parsedModalInfo)
      } catch (error) {
        console.error('Error parsing modalInfo:', error)
        setModalInfo(null)
      }
    } else {
      setModalInfo(null)
    }
  }, [searchParams])

  useEffect(() => {
    setModalInfo(null)
  }, [pathname])



  return (
    <>
      {modalInfo && (
        <Modal
          title={modalInfo.title}
          description={modalInfo.description}
        />
      )}
      {children}
    </>
  )
}

export default ModalWrapper
