'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const PUBLIC_PATHS = ['/login', '/register', '/reset-password']

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.includes(pathname)

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login')
    }

    if (isAuthenticated && isPublicPath) {
      router.push('/')
    }
  }, [isAuthenticated, pathname, router])

  return <>{children}</>
}
