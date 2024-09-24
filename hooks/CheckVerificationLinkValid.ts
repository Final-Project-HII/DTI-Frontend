import React, { useEffect, useState } from 'react'

interface FormData {
  email: string | null
  token: string | null
}

interface VerificationResponse {
  data: string
}

const CheckVerificationLinkValid = (formData: FormData) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] =
    useState<String>('Expired')

  useEffect(() => {
    const fetchVerificationLinkStatus = async () => {
      if (!formData.email || !formData.token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/users/check-verification`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(formData),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch verification link status')
        }

        const data: VerificationResponse = await response.json()
        setVerificationStatus(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchVerificationLinkStatus()
  }, [formData])

  return { verificationStatus, loading, error }
}

export default CheckVerificationLinkValid
