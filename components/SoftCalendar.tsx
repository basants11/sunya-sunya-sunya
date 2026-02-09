"use client"

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface SoftCalendarProps {
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  minDate?: Date
  className?: string
}

export default function SoftCalendar({
  selectedDate,
  onDateSelect,
  minDate = addDays(new Date(), 1), // Default to tomorrow
  className = ''
}: SoftCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous month to fill the first week
  const startDate = monthStart
  const dayOfWeek = startDate.getDay()
  const prevMonthDays = dayOfWeek > 0 ? dayOfWeek : 0
  const prevMonthStart = subMonths(monthStart, 1)
  const prevMonthEnd = endOfMonth(prevMonthStart)
  const prevDays = prevMonthDays > 0
    ? eachDayOfInterval({
        start: new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - prevMonthDays + 1),
        end: prevMonthEnd
      })
    : []

  // Add days from next month to fill the last week
  const endDayOfWeek = monthEnd.getDay()
  const nextMonthDays = endDayOfWeek < 6 ? 6 - endDayOfWeek : 0
  const nextMonthStart = addMonths(monthStart, 1)
  const nextDays = nextMonthDays > 0
    ? eachDayOfInterval({
        start: nextMonthStart,
        end: new Date(nextMonthStart.getFullYear(), nextMonthStart.getMonth(), nextMonthDays)
      })
    : []

  const allDays = [...prevDays, ...calendarDays, ...nextDays]

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    if (isBefore(date, minDate)) return
    onDateSelect(date)
  }

  const isDateDisabled = (date: Date) => isBefore(date, minDate)
  const isDateSelected = (date: Date) => selectedDate && isSameDay(date, selectedDate)
  const isDateToday = (date: Date) => isToday(date)

  return (
    <div className={`bg-rose-50 p-4 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-rose-100 rounded-full transition-colors duration-150 transform hover:scale-105"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-rose-600" />
        </button>
        <h3 className="text-lg font-semibold text-rose-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-rose-100 rounded-full transition-colors duration-150 transform hover:scale-105"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-rose-600" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-sm font-medium text-rose-600 text-center py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((date, index) => {
          const isCurrentMonth = date >= monthStart && date <= monthEnd
          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const today = isDateToday(date)

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={`
                w-10 h-10 text-base font-medium rounded-md transition-all duration-150
                ${selected ? 'bg-warm-peach text-luxury-charcoal scale-105' : 'hover:bg-rose-100'}
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-rose-700'}
                ${today && !selected ? 'ring-1 ring-rose-200' : ''}
                ${!isCurrentMonth ? 'text-gray-400' : ''}
              `}
            >
              {format(date, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}