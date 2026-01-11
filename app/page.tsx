'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/store/auth-store'
import authService from '@/lib/api/auth-service'
import { useRouter } from 'next/navigation'
import { Homepage } from '@/components/homepage'

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    // todo: check if logout needs to call an API
    logout()
    router.push('/login')
  }

  return (
    <>
      {isAuthenticated ? (
        <div className='space-y-4'>
          <p>Welcome!</p>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800'
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='space-x-4'>
          <Homepage />
        </div>
      )}
    </>
  )
}
