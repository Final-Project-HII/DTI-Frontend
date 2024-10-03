import { useState } from 'react'
import axios from 'axios'

const RegisterNewUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const AddNewUser = async (formData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_API_URL}api/users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      setIsLoading(false)
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to register user')
      } else {
        setError('An unexpected error occurred')
      }
      setIsLoading(false)
    }
  }

  return { AddNewUser, isLoading, error }
}

export default RegisterNewUser
