import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface StepItem {
  id: string | number
  label: string
}

export interface ProgressStepperProps {
  steps: StepItem[]
  currentStep: number // 0-indexed
  className?: string
  onStepClick?: (stepIndex: number) => void
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  className,
  onStepClick,
}) => {
  return (
    <div className={cn('w-full select-none py-2', className)}>
      <div className="relative flex items-center justify-between">
        {/* Continuous progress track behind circles */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-highest z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 z-0"
          style={{
            width: `${steps.length > 1 ? (Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100 : 0}%`,
          }}
        />

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isCurrent = idx === currentStep
          const isClickable = onStepClick && idx <= currentStep

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center cursor-default"
              onClick={() => isClickable && onStepClick(idx)}
            >
              <div
                className={cn(
                  'h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center font-sans font-bold text-xs sm:text-sm transition-all duration-200',
                  isCompleted && 'bg-primary text-on-primary shadow-sm',
                  isCurrent &&
                    'bg-primary text-on-primary ring-4 ring-primary-container/50 shadow-md scale-105',
                  !isCompleted &&
                    !isCurrent &&
                    'bg-surface-container-highest text-on-surface-variant/70 border border-outline-variant/60',
                  isClickable && 'cursor-pointer hover:scale-105'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs sm:text-sm font-sans tracking-tight text-center whitespace-nowrap',
                  isCurrent ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
