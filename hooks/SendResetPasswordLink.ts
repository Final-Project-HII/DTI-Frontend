import React, { useState } from 'react'
import axios from 'axios'

const SendResetPasswordLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewResetPasswordLink = async (email: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/users/reset-password?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.data) {
        throw new Error('Failed to send reset password link')
      }
      const data = response.data
      setIsLoading(false)
      return data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return { AddNewResetPasswordLink, isLoading, error }
}

export default SendResetPasswordLink
