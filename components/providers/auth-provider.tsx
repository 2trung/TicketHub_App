'use client'

import { useEffect, useState } from 'react'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Prevent hydration mismatch by showing nothing until client is ready
  if (!isHydrated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div>Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
