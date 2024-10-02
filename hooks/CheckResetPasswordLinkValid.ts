import React, { useEffect, useState } from 'react'
import axios from 'axios'

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
        const response = await axios.post<ResetPasswordResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}api/users/check-reset-password`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        setResetPasswordLinkStatus(response.data.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchResetPasswordLinkStatus()
  }, [formData])

  return { resetPasswordLinkStatus, loading, error }
}

export default CheckResetPasswordLinkValid
