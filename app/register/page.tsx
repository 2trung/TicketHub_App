'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useAuthStore } from '@/lib/store/auth-store'
import authService from '@/lib/api/auth-service'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authService.register({ email, password })
      if (response) {
        setSuccess(true)
      }
    } catch (err) {
      console.log(typeof err)
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
      <div className='w-full max-w-md p-8'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Register</h1>

        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
            {error}
          </div>
        )}

        {success && (
          <div className='mb-4 p-3 bg-green-100 text-green-700 rounded'>
            Registration successful! Please check your email to verify your
            account.
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
              className='w-full py-2 px-3 border rounded border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200'
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
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full py-2 pr-8 pl-3 border rounded border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
              >
                {showPassword ? (
                  <AiOutlineEye
                    className='transition-opacity duration-200'
                    size={20}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className='transition-opacity duration-200'
                    size={20}
                  />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium mb-1'
            >
              Confirm Password
            </label>
            <div className='relative'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full py-2 pr-8 pl-3 border rounded border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200'
                required
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
              >
                {showConfirmPassword ? (
                  <AiOutlineEye
                    className='transition-opacity duration-200'
                    size={20}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className='transition-opacity duration-200'
                    size={20}
                  />
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full p-2 bg-[#4C7EDE] text-white rounded hover:bg-sky-600 disabled:opacity-50 cursor-pointer shadow-md'
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <div className='mt-4 text-center space-y-0.5'>
          <p className='text-slate-800'>Already have an account?</p>
          <p>
            <Link href='/login' className='text-blue-800 hover:underline'>
              Login
            </Link>
          </p>
        </div>

        {success && (
          <div className='mt-4 text-center'>
            <Link
              href='/login'
              className='text-blue-800 hover:underline font-medium'
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
