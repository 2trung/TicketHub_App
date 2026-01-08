'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/auth-store'
import authService from '@/lib/api/auth-service'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      setAuth(response.user, response.tokens)
      router.push('/')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 border rounded-lg'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium mb-1'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium mb-1'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full p-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50'
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className='mt-4 text-center space-y-2'>
          <p>
            <Link
              href='/reset-password'
              className='text-blue-600 hover:underline'
            >
              Forgot password?
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-blue-600 hover:underline'>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
