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
import { THEME } from '@/lib/theme'

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
      <Box sx={{ width: 280, flexShrink: 0 }}>
        {/* Month header */}
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '1rem',
            mb: 2,
            color: THEME.carbon,
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
                fontWeight: 600,
                color: THEME.lightBlack,
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
                      ? THEME.flamingo
                      : inRange
                      ? THEME.flamingoLight
                      : 'transparent',
                  color: isStart || isEnd ? '#fff' : THEME.carbon,
                  fontSize: '0.875rem',
                  fontWeight: isStart || isEnd ? 600 : 400,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor:
                      isStart || isEnd
                        ? THEME.flamingoHover
                        : THEME.flamingoLight,
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
                        backgroundColor: THEME.flamingo,
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
          border: `1px solid ${THEME.lightBlack}`,
          borderRadius: '32px',
          padding: '3px 10px 3px 3px',
          minWidth: 220,
          backgroundColor: 'transparent',
        }}
      >
        <div className='bg-carbon p-3 rounded-4xl'>
          <CalendarIcon className='text-alabaster' size={24} />
        </div>
        <Typography
          sx={{
            fontSize: startDate ? '1rem' : '0.875rem',
            color: startDate ? THEME.carbon : THEME.lightBlack,
          }}
        >
          {startDate ? formatDisplayDate(startDate) : placeholder.start}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: THEME.lightBlack }}>
          -
        </Typography>
        <Typography
          sx={{
            fontSize: endDate ? '1rem' : '0.875rem',
            color: endDate ? THEME.carbon : THEME.lightBlack,
          }}
        >
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
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(35, 35, 35, 0.2)',
              backgroundColor: THEME.alabaster,
              maxWidth: '95vw',
              maxHeight: '90vh',
            },
          },
        }}
      >
        <Box sx={{ p: 3, width: 'auto' }}>
          {/* Date inputs */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: THEME.lightBlack,
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
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
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    '& fieldset': {
                      borderColor: THEME.lightBlack,
                    },
                    '&:hover fieldset': {
                      borderColor: THEME.flamingo,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: THEME.flamingo,
                    },
                  },
                  width: '100%',
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 150px', minWidth: 150 }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: THEME.lightBlack,
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
                End Date
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
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    '& fieldset': {
                      borderColor: THEME.lightBlack,
                    },
                    '&:hover fieldset': {
                      borderColor: THEME.flamingo,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: THEME.flamingo,
                    },
                  },
                  width: '100%',
                }}
              />
            </Box>
          </Box>

          {/* Calendars with horizontal scroll for mobile */}
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              position: 'relative',
              overflowX: 'auto',
              pb: 1,
              mx: -1,
              px: 1,
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(45, 45, 45, 0.1)',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: THEME.flamingo,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: THEME.flamingoHover,
                },
              },
            }}
          >
            {/* Left navigation */}
            <IconButton
              onClick={handlePrevMonth}
              sx={{
                position: 'sticky',
                left: 0,
                alignSelf: 'center',
                zIndex: 1,
                width: 40,
                height: 40,
                minWidth: 40,
                color: THEME.flamingo,
                backgroundColor: THEME.flamingoLight,
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: THEME.flamingoLight,
                },
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
                position: 'sticky',
                right: 0,
                alignSelf: 'center',
                zIndex: 1,
                width: 40,
                height: 40,
                minWidth: 40,
                color: THEME.flamingo,
                backgroundColor: THEME.flamingoLight,
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: THEME.flamingoLight,
                },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              onClick={handleReset}
              sx={{
                color: THEME.flamingo,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: THEME.flamingoLight,
                },
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
                  borderColor: THEME.lightBlack,
                  color: THEME.carbon,
                  borderRadius: '24px',
                  px: 3,
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: THEME.carbon,
                    backgroundColor: 'rgba(35, 35, 35, 0.05)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                variant='contained'
                sx={{
                  textTransform: 'none',
                  backgroundColor: THEME.flamingo,
                  borderRadius: '24px',
                  px: 3,
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: THEME.flamingoHover,
                    boxShadow: 'none',
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
