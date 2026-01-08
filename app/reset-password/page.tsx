'use client'

import { useState } from 'react'
import Link from 'next/link'
import authService from '@/lib/api/auth-service'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    try {
      await authService.resetPassword({ email })
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send reset email. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 border rounded-lg'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Reset Password</h1>

        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
            {error}
          </div>
        )}

        {success ? (
          <div className='text-center'>
            <div className='mb-4 p-3 bg-green-100 text-green-700 rounded'>
              Password reset email sent! Check your inbox.
            </div>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className='text-gray-600 mb-4 text-center'>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium mb-1'
                >
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

              <button
                type='submit'
                disabled={isLoading}
                className='w-full p-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50'
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className='mt-4 text-center'>
              <Link href='/login' className='text-blue-600 hover:underline'>
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
