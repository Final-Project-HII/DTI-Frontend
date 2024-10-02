import axios from 'axios'
import { useState } from 'react'

const SendNewVerificationLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewVerificationLink = async (email: string | null) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/users/new-verification-link?email=${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.data) {
        throw new Error('Failed to create event')
      }
      const data = response.data
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
