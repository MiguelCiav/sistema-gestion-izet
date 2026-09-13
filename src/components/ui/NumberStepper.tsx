import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface NumberStepperProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
  className?: string
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  unit,
  disabled = false,
  className,
}) => {
  const handleDecrement = () => {
    const nextVal = Math.max(min, Number((value - step).toFixed(3)))
    onChange(nextVal)
  }

  const handleIncrement = () => {
    const nextVal = max !== undefined ? Math.min(max, Number((value + step).toFixed(3))) : Number((value + step).toFixed(3))
    onChange(nextVal)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value)
    if (isNaN(parsed)) {
      onChange(min)
      return
    }
    let validated = parsed
    if (min !== undefined && validated < min) validated = min
    if (max !== undefined && validated > max) validated = max
    onChange(validated)
  }

  const isMinDisabled = disabled || (min !== undefined && value <= min)
  const isMaxDisabled = disabled || (max !== undefined && value >= max)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMinDisabled}
          aria-label="Disminuir cantidad"
          className={cn(
            'h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md transition-all duration-200',
            'hover:bg-[#285237] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            isMinDisabled && 'opacity-40 cursor-not-allowed active:scale-100 hover:bg-primary shadow-none'
          )}
        >
          <Minus className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
        </button>

        <div className="flex flex-col items-center">
          <div className="h-16 w-20 sm:h-20 sm:w-24 rounded-2xl border-2 border-outline-variant/60 bg-surface-container-lowest flex items-center justify-center shadow-inner focus-within:border-primary transition-colors">
            <input
              type="number"
              value={value}
              onChange={handleInputChange}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              className="w-full text-center font-display text-2xl sm:text-3xl font-bold text-on-surface bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Cantidad numérica"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          aria-label="Aumentar cantidad"
          className={cn(
            'h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md transition-all duration-200',
            'hover:bg-[#285237] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            isMaxDisabled && 'opacity-40 cursor-not-allowed active:scale-100 hover:bg-primary shadow-none'
          )}
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
        </button>
      </div>

      {unit && (
        <span className="text-xs sm:text-sm font-sans font-semibold text-on-surface-variant bg-surface-container px-3 py-0.5 rounded-full">
          {unit}
        </span>
      )}
    </div>
  )
}
