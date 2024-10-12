import React, { useState } from 'react'
import axios from 'axios'
import { BASE_URL_DEV } from '@/utils/api'

const SendNewResetPasswordLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewResetPasswordLink = async (email: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${BASE_URL_DEV}/users/new-reset-password-link?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = response.data
      setIsLoading(false)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return { AddNewResetPasswordLink, isLoading, error }
}

export default SendNewResetPasswordLink
