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

interface EnhancedCalendarPickerProps {
  selectedDates: Date[]
  onDatesSelect: (dates: Date[]) => void
  maxSelections?: number
  minDate?: Date
  className?: string
}

export default function EnhancedCalendarPicker({
  selectedDates = [],
  onDatesSelect,
  maxSelections = 3,
  minDate = addDays(new Date(), 1), // Default to tomorrow
  className = ''
}: EnhancedCalendarPickerProps) {
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

    const isSelected = selectedDates.some(selectedDate => isSameDay(date, selectedDate))

    let newSelectedDates: Date[]
    if (isSelected) {
      // Remove the date
      newSelectedDates = selectedDates.filter(selectedDate => !isSameDay(date, selectedDate))
    } else {
      // Add the date if under limit
      if (selectedDates.length < maxSelections) {
        newSelectedDates = [...selectedDates, date]
      } else {
        return // Don't add if at limit
      }
    }

    onDatesSelect(newSelectedDates)
  }

  const isDateDisabled = (date: Date) => isBefore(date, minDate)
  const isDateSelected = (date: Date) => selectedDates.some(selectedDate => isSameDay(date, selectedDate))
  const isDateToday = (date: Date) => isToday(date)

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-border/30 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-muted-rose/20 rounded-full transition-colors duration-150 transform hover:scale-105"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-muted-rose" />
        </button>
        <h3 className="text-lg font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-muted-rose/20 rounded-full transition-colors duration-150 transform hover:scale-105"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-muted-rose" />
        </button>
      </div>

      {/* Selection Counter */}
      <div className="text-sm text-muted-foreground mb-4 text-center">
        Selected: {selectedDates.length} / {maxSelections} days
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-sm font-medium text-muted-rose text-center py-2">
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
                ${selected ? 'bg-muted-rose text-luxury-charcoal scale-105' : 'hover:bg-muted-rose/20'}
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-muted-rose'}
                ${today && !selected ? 'ring-1 ring-muted-rose/50' : ''}
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