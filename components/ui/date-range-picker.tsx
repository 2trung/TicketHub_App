'use client'

import { useState, useRef } from 'react'
import {
  Box,
  Button,
  IconButton,
  Popover,
  TextField,
  Typography,
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { FiCalendar as CalendarIcon } from 'react-icons/fi'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  getDay,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
} from 'date-fns'

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void
  className?: string
  placeholder?: {
    start?: string
    end?: string
  }
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  className,
  placeholder = { start: 'DD/MM/YYYY', end: 'DD/MM/YYYY' },
}: DateRangePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [leftMonth, setLeftMonth] = useState<Date>(startOfMonth(new Date()))
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate)
  const triggerRef = useRef<HTMLDivElement>(null)

  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setTempStartDate(startDate)
    setTempEndDate(endDate)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleApply = () => {
    onChange(tempStartDate, tempEndDate)
    handleClose()
  }

  const handleReset = () => {
    setTempStartDate(null)
    setTempEndDate(null)
  }

  const handleCancel = () => {
    setTempStartDate(startDate)
    setTempEndDate(endDate)
    handleClose()
  }

  const handlePrevMonth = () => {
    setLeftMonth(subMonths(leftMonth, 1))
  }

  const handleNextMonth = () => {
    setLeftMonth(addMonths(leftMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start fresh selection
      setTempStartDate(date)
      setTempEndDate(null)
    } else {
      // Complete the range
      if (isBefore(date, tempStartDate)) {
        setTempEndDate(tempStartDate)
        setTempStartDate(date)
      } else {
        setTempEndDate(date)
      }
    }
  }

  const isDateInRange = (date: Date): boolean => {
    if (!tempStartDate || !tempEndDate) return false
    return isWithinInterval(date, { start: tempStartDate, end: tempEndDate })
  }

  const isStartDate = (date: Date): boolean => {
    return tempStartDate ? isSameDay(date, tempStartDate) : false
  }

  const isEndDate = (date: Date): boolean => {
    return tempEndDate ? isSameDay(date, tempEndDate) : false
  }

  const rightMonth = addMonths(leftMonth, 1)

  const renderCalendar = (month: Date) => {
    const daysInMonth = getDaysInMonth(month)
    const firstDayOfWeek = getDay(startOfMonth(month))
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i))
    }

    return (
      <Box sx={{ width: 280 }}>
        {/* Month header */}
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            fontSize: '1rem',
            mb: 2,
            color: '#1a1a1a',
          }}
        >
          {format(month, 'MMM yyyy')}
        </Typography>

        {/* Day headers */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            mb: 1,
          }}
        >
          {DAYS.map((day) => (
            <Typography
              key={day}
              sx={{
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#666',
                py: 0.5,
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Calendar grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {days.map((date, index) => {
            if (!date) {
              return <Box key={`empty-${index}`} sx={{ height: 36 }} />
            }

            const isStart = isStartDate(date)
            const isEnd = isEndDate(date)
            const inRange = isDateInRange(date)
            const isToday = isSameDay(date, new Date())

            return (
              <Box
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                sx={{
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: isStart || isEnd ? '50%' : 0,
                  backgroundColor:
                    isStart || isEnd
                      ? '#1976d2'
                      : inRange
                      ? '#e3f2fd'
                      : 'transparent',
                  color: isStart || isEnd ? '#fff' : '#333',
                  fontSize: '0.875rem',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: isStart || isEnd ? '#1565c0' : '#e3f2fd',
                  },
                  ...(isToday &&
                    !isStart &&
                    !isEnd && {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 16,
                        height: 2,
                        backgroundColor: '#1976d2',
                        borderRadius: 1,
                      },
                    }),
                }}
              >
                {date.getDate()}
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }

  const formatDisplayDate = (date: Date | null): string => {
    return date ? format(date, 'dd/MM/yyyy') : ''
  }

  return (
    <>
      <Box
        ref={triggerRef}
        onClick={handleOpen}
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          border: '1px solid rgb(45 45 45)',
          borderRadius: '32px',
          padding: '3px 8px 3px 3px',
          minWidth: 220,
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: '#1976d2',
          },
        }}
      >
        <div className='bg-light-black p-3 rounded-4xl'>
          <CalendarIcon className='text-alabaster' size={24} />
        </div>
        <Typography sx={{ color: startDate ? '#1a1a1a' : '#999' }}>
          {startDate ? formatDisplayDate(startDate) : placeholder.start}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>-</Typography>
        <Typography sx={{ color: endDate ? '#1a1a1a' : '#999' }}>
          {endDate ? formatDisplayDate(endDate) : placeholder.end}
        </Typography>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            },
          },
        }}
      >
        <Box sx={{ p: 3, width: 'auto' }}>
          {/* Date inputs */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 0.5 }}>
                Start Date
              </Typography>
              <TextField
                size='small'
                value={formatDisplayDate(tempStartDate)}
                placeholder={placeholder.start}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                  width: 180,
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 0.5 }}>
                End date
              </Typography>
              <TextField
                size='small'
                value={formatDisplayDate(tempEndDate)}
                placeholder={placeholder.end}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                  width: 180,
                }}
              />
            </Box>
          </Box>

          {/* Calendars */}
          <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
            {/* Left navigation */}
            <IconButton
              onClick={handlePrevMonth}
              sx={{
                position: 'absolute',
                left: -8,
                top: 0,
                color: '#1976d2',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>

            {/* Left calendar */}
            {renderCalendar(leftMonth)}

            {/* Right calendar */}
            {renderCalendar(rightMonth)}

            {/* Right navigation */}
            <IconButton
              onClick={handleNextMonth}
              sx={{
                position: 'absolute',
                right: -8,
                top: 0,
                color: '#1976d2',
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleReset}
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Reset
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={handleCancel}
                variant='outlined'
                sx={{
                  textTransform: 'none',
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  borderRadius: 1,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                variant='contained'
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#1976d2',
                  borderRadius: 1,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
