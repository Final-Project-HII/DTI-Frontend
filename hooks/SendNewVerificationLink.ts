import React, { useState } from 'react'

const SendNewVerificationLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewVerificationLink = async (email: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/new-verification-link?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to create event')
      }
      const data = await response.json()
      setIsLoading(false)
      return data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return { AddNewVerificationLink, isLoading, error }
}

export default SendNewVerificationLink
