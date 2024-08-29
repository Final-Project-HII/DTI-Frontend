import React, { useState } from 'react'

const SendResetPasswordLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewResetPasswordLink = async (email: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/reset-password?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to send reset password link')
      }
      const data = await response.json()
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
