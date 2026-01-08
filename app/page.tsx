'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/store/auth-store'
import authService from '@/lib/api/auth-service'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    logout()
    router.push('/login')
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-6'>Ticket Hub</h1>

        {isAuthenticated ? (
          <div className='space-y-4'>
            <p>Welcome, {user?.name}!</p>
            <button
              onClick={handleLogout}
              className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800'
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='space-x-4'>
            <Link
              href='/login'
              className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800 inline-block'
            >
              Login
            </Link>
            <Link
              href='/register'
              className='px-4 py-2 border rounded hover:bg-gray-100 inline-block'
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
