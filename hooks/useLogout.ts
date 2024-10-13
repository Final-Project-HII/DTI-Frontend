'use server'

import { BASE_URL_DEV } from '@/utils/api'
import axios from 'axios'
import { cookies } from 'next/headers'

interface LogoutResponse {
  message: string
}

export async function logout(token: string): Promise<void> {
  try {
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await axios.post<LogoutResponse>(
      `${BASE_URL_DEV}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

  console.log(response)
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
