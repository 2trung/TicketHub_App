'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/auth-store'
import authService from '@/lib/api/auth-service'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authService.register({ email, password })
      setAuth(response.user, response.tokens)
      router.push('/')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 border rounded-lg'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Register</h1>

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

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium mb-1'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full p-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50'
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-600 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
