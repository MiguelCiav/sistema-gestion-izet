import React from 'react'
import { AlertTriangle, AlertCircle, Clock, ShieldAlert, CheckCircle2, Share2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export type StatusBadgeVariant =
  | 'regulado'
  | 'critico'
  | 'alerta'
  | 'vencido'
  | 'proximo_vencer'
  | 'disponible'
  | 'prestamo'
  | 'comun'
  | 'neutral'

export interface StatusBadgeProps {
  variant: StatusBadgeVariant
  label?: string
  icon?: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

const defaultLabels: Record<StatusBadgeVariant, string> = {
  regulado: 'Regulado',
  critico: 'Sin Existencia',
  alerta: 'En Escasez',
  vencido: 'Vencido',
  proximo_vencer: 'Próximo a Vencer',
  disponible: 'Disponible',
  prestamo: 'En Préstamo',
  comun: 'Uso Común',
  neutral: 'General',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  icon,
  size = 'md',
  className,
}) => {
  const displayLabel = label || defaultLabels[variant]

  const variantStyles: Record<StatusBadgeVariant, string> = {
    regulado: 'bg-error-container text-on-error-container border border-error/20',
    critico: 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20',
    alerta: 'bg-[#fbdfa8] text-[#251a00] border border-[#6a572b]/30',
    vencido: 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20',
    proximo_vencer: 'bg-[#fef3c7] text-[#92400e] border border-[#d97706]/20',
    disponible: 'bg-primary-fixed text-on-primary-fixed-variant border border-primary/20',
    prestamo: 'bg-secondary-container text-on-secondary-container border border-secondary/20',
    comun: 'bg-[#dcfce7] text-[#166534] border border-[#22c55e]/20',
    neutral: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/40',
  }

  const defaultIcons: Partial<Record<StatusBadgeVariant, React.ReactNode>> = {
    regulado: <ShieldAlert className="h-3.5 w-3.5 shrink-0" />,
    critico: <AlertCircle className="h-3.5 w-3.5 shrink-0" />,
    alerta: <AlertTriangle className="h-3.5 w-3.5 shrink-0" />,
    vencido: <AlertCircle className="h-3.5 w-3.5 shrink-0" />,
    proximo_vencer: <Clock className="h-3.5 w-3.5 shrink-0" />,
    disponible: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />,
    prestamo: <Share2 className="h-3.5 w-3.5 shrink-0" />,
  }

  const displayIcon = icon !== undefined ? icon : defaultIcons[variant]

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-sans font-bold rounded-full select-none tracking-tight',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {displayIcon}
      <span>{displayLabel}</span>
    </span>
  )
}
