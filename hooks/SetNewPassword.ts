import React, { useState } from 'react'

const SetNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewPassword = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/set-password`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(formData),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to set password')
      }
      const data = await response.json()
      setIsLoading(false)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return { AddNewPassword, isLoading, error }
}

export default SetNewPassword
