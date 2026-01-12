import { useState } from 'react'
import { MenuItem, Select } from '@mui/material'
import { IoNavigateOutline } from 'react-icons/io5'
import { IoMenu } from 'react-icons/io5'
import { FaArrowRightLong } from 'react-icons/fa6'
import { DateRangePicker } from './ui/date-range-picker'
import { MobileMenu } from './ui/mobile-menu'
import Link from 'next/link'

export const Homepage = () => {
  const locations = ['Current Location', 'Hanoi', 'Da Nang', 'Ho Chi Minh']
  const [location, setLocation] = useState<string>(locations[0])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <div className='min-h-screen bg-carbon px-5 py-4 gap-4 flex flex-col'>
      <div className='bg-alabaster py-4 px-6 flex items-center justify-between gap-3.5 rounded-4xl'>
        <div className='flex items-center 2xl:gap-8 lg:gap-7 gap-6'>
          <Link href='/'>
            <h1 className='text-2xl font-bold text-black'>Ticket Hub</h1>
          </Link>
          {/* Divider */}
          <div className='md:block hidden h-8 border-l border-light-black' />

          <div className='flex items-center gap-3'>
            {/* Location selector */}
            <div className='items-center xl:flex hidden'>
              <Select
                value={location}
                startAdornment={
                  <div
                    className='bg-carbon p-3 rounded-4xl cursor-pointer'
                    onClick={() => {}}
                  >
                    <IoNavigateOutline className='text-alabaster' size={24} />
                  </div>
                }
                endAdornment={null}
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
                  // minWidth: 180,
                  borderRadius: '32px',
                }}
                IconComponent={() => null}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Date picker */}
            <DateRangePicker
              className='xl:flex hidden'
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
            />

            {/* Seach input */}
            <div className='bg-alabaster border border-light-black rounded-4xl py-0.75 pl-4 pr-1 2xl:w-xl xl:w-96 lg:w-xl md:w-72 w-16 hidden items-center gap-2 shrink-0 md:flex'>
              <input
                type='text'
                placeholder='Search for keywords...'
                className=' focus:outline-none w-full'
              />
              <button className='p-3 bg-carbon rounded-4xl cursor-pointer'>
                <FaArrowRightLong className='text-alabaster' size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Login/Register button */}
        <button className='py-3.5 px-5 bg-flamingo rounded-4xl cursor-pointer text-white font-medium hidden md:block transition-all duration-300 hover:rounded-xl'>
          <Link href='/login'>Login/Register</Link>
        </button>

        {/* Hamburger menu for mobile */}
        <button
          className='p-3 bg-flamingo rounded-4xl cursor-pointer md:hidden flex transition-all duration-300 hover:rounded-xl'
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <IoMenu className='text-alabaster' size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        location={location}
        locations={locations}
        onLocationChange={setLocation}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => {
          setStartDate(start)
          setEndDate(end)
        }}
      />

      <div className='h-64 bg-alabaster rounded-4xl' />
      <div className='flex gap-4'>
        <div className='h-100 w-[60%] bg-flamingo rounded-4xl' />
        <div className='h-100 w-[40%] bg-light-black rounded-4xl' />
      </div>
    </div>
  )
}
