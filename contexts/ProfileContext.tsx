'use client';
import { useFetchProfileData } from '@/hooks/useProfileData'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ProfileData {
  email: string
  warehouseId: number | null
  displayName: string
  phoneNumber: string | undefined
  avatar: string | null
  password: string | null
}

interface ProfileContextType {
  profileData: ProfileData | null
  error: string | null
  fetchProfileData: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const fetchProfileDataHook = useFetchProfileData()

  const fetchProfileData = async () => {
    try {
      const data = await fetchProfileDataHook()
      setProfileData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  return (
    <ProfileContext.Provider value={{ profileData, error, fetchProfileData }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileData = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfileData must be used within a ProfileProvider')
  }
  return context
}

export default useProfileData