import React, { useEffect, useState } from 'react'
interface FormData {
  email: string | null
  token: string | null
}

interface ResetPasswordResponse {
  data: boolean
}
const CheckResetPasswordLinkValid = (formData: FormData) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resetPasswordLinkStatus, setResetPasswordLinkStatus] =
    useState<boolean>(false)

  useEffect(() => {
    const fetchResetPasswordLinkStatus = async () => {
      if (!formData.email || !formData.token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/users/check-reset-password`,
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

        const data: ResetPasswordResponse = await response.json()
        setResetPasswordLinkStatus(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchResetPasswordLinkStatus()
  }, [formData])

  return { resetPasswordLinkStatus, loading, error }
}

export default CheckResetPasswordLinkValid
