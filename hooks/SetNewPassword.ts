import React, { useState } from 'react'
import axios from 'axios'

const SetNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewPassword = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/users/set-password`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.data) {
        throw new Error('Failed to set password')
      }
      const data = response.data
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
