import { BASE_URL_DEV } from '@/utils/api'
import axios from 'axios'
import { useSession } from 'next-auth/react'

interface ProfileData {
  email: string
  warehouseId: number | null
  displayName: string
  phoneNumber: string | undefined
  avatar: string | null
  password: string | null
}

export const useFetchProfileData = () => {
  const { data: session } = useSession()

  const fetchProfileData = async () => {
    try {
      const response = await axios.get<{ data: ProfileData }>(
        `${BASE_URL_DEV}/users/profile`,
        {
          headers: { Authorization: `Bearer ${session?.user.accessToken}` },
        }
      )
      return response.data.data
    } catch (err) {
      console.error('Error fetching profile data:', err)
      throw err
    }
  }

  return fetchProfileData
}
