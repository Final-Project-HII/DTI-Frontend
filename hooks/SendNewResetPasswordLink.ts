import React, { useState } from 'react'

const SendNewResetPasswordLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewResetPasswordLink = async (email: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/users/new-reset-password-link?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to create new reset password link')
      }
      const data = await response.json()
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
