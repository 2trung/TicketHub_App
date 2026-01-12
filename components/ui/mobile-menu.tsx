'use client'

import { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { LuNavigation } from 'react-icons/lu'
import { FaArrowRightLong } from 'react-icons/fa6'
import { MenuItem, Select } from '@mui/material'
import { DateRangePicker } from './date-range-picker'
import Link from 'next/link'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  location: string
  locations: string[]
  onLocationChange: (location: string) => void
  startDate: Date | null
  endDate: Date | null
  onDateChange: (start: Date | null, end: Date | null) => void
}

export const MobileMenu = ({
  isOpen,
  onClose,
  location,
  locations,
  onLocationChange,
  startDate,
  endDate,
  onDateChange,
}: MobileMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-alabaster z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-light-black'>
          <h2 className='text-xl font-bold text-black'>Menu</h2>
          <button
            onClick={onClose}
            className='p-2 bg-carbon rounded-full hover:bg-flamingo transition-colors cursor-pointer'
          >
            <IoClose className='text-alabaster' size={24} />
          </button>
        </div>

        {/* Menu Content */}
        <div className='flex flex-col gap-6 p-5 overflow-y-auto h-[calc(100%-80px)]'>
          {/* Location selector */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-light-black'>
              Location
            </label>
            <Select
              value={location}
              fullWidth
              startAdornment={
                <div className='bg-carbon p-2 rounded-4xl cursor-pointer mr-2'>
                  <LuNavigation className='text-alabaster' size={20} />
                </div>
              }
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(45 45 45)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(45 45 45)',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px !important',
                },
                paddingLeft: '4px',
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingRight: '8px',
                borderRadius: '32px',
              }}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Date picker */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-light-black'>Date</label>
            <div className='w-full overflow-visible'>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={onDateChange}
              />
            </div>
          </div>

          {/* Search input */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-light-black'>
              Search
            </label>
            <div className='bg-white border border-light-black rounded-4xl py-2 pl-4 pr-1 flex items-center gap-2'>
              <input
                type='text'
                placeholder='Search for keywords...'
                className='focus:outline-none w-full'
              />
              <button className='p-3 bg-carbon rounded-4xl cursor-pointer'>
                <FaArrowRightLong className='text-alabaster' size={20} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-light-black' />

          {/* Login/Register button */}
          <Link href='/login' onClick={onClose}>
            <button className='w-full py-4 px-5 bg-flamingo rounded-4xl cursor-pointer text-white font-medium transition-all duration-300 hover:rounded-xl hover:bg-opacity-90'>
              Login/Register
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
