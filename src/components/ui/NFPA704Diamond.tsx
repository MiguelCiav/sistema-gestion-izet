import React from 'react'
import { cn } from '../../lib/utils'

export interface NFPA704Props {
  salud?: number
  inflamabilidad?: number
  inestabilidad?: number
  especial?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showLabelsTooltip?: boolean
}

const sizeMap = {
  xs: 'w-10 h-10',
  sm: 'w-14 h-14',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
  xl: 'w-36 h-36',
}

export const NFPA704Diamond: React.FC<NFPA704Props> = ({
  salud = 0,
  inflamabilidad = 0,
  inestabilidad = 0,
  especial = '',
  size = 'md',
  className,
  showLabelsTooltip = true,
}) => {
  const clampNFPA = (val?: number) => {
    if (val === undefined || val === null || isNaN(val)) return 0
    return Math.max(0, Math.min(4, Math.round(val)))
  }

  const sVal = clampNFPA(salud)
  const fVal = clampNFPA(inflamabilidad)
  const iVal = clampNFPA(inestabilidad)
  const specText = especial ? especial.trim().toUpperCase() : ''

  const tooltipText = `NFPA 704: Salud: ${sVal}, Inflamabilidad: ${fVal}, Inestabilidad: ${iVal}${
    specText ? `, Especial: ${specText}` : ''
  }`

  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0', sizeMap[size], className)}
      title={showLabelsTooltip ? tooltipText : undefined}
      role="img"
      aria-label={tooltipText}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Quadrant: Inflamabilidad (Rojo) */}
        <polygon
          points="50,2 74,26 50,50 26,26"
          fill="#dc2626"
          stroke="#181c1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text
          x="50"
          y="26"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize="18"
          fontWeight="bold"
          fontFamily="'Nunito Sans', sans-serif"
        >
          {fVal}
        </text>

        {/* Left Quadrant: Salud (Azul) */}
        <polygon
          points="26,26 50,50 26,74 2,50"
          fill="#2563eb"
          stroke="#181c1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text
          x="26"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize="18"
          fontWeight="bold"
          fontFamily="'Nunito Sans', sans-serif"
        >
          {sVal}
        </text>

        {/* Right Quadrant: Inestabilidad / Reactividad (Amarillo) */}
        <polygon
          points="74,26 98,50 74,74 50,50"
          fill="#eab308"
          stroke="#181c1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text
          x="74"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#181c1b"
          fontSize="18"
          fontWeight="bold"
          fontFamily="'Nunito Sans', sans-serif"
        >
          {iVal}
        </text>

        {/* Bottom Quadrant: Riesgo Especial (Blanco) */}
        <polygon
          points="50,50 74,74 50,98 26,74"
          fill="#ffffff"
          stroke="#181c1b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {specText === 'W' || specText === '-W-' || specText === 'W/' ? (
          <g>
            <text
              x="50"
              y="74"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#181c1b"
              fontSize="14"
              fontWeight="bold"
              fontFamily="'Nunito Sans', sans-serif"
            >
              W
            </text>
            <line x1="42" y1="74" x2="58" y2="74" stroke="#181c1b" strokeWidth="2" />
          </g>
        ) : (
          <text
            x="50"
            y="74"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#181c1b"
            fontSize={specText.length > 2 ? '10' : '13'}
            fontWeight="bold"
            fontFamily="'Nunito Sans', sans-serif"
          >
            {specText}
          </text>
        )}
      </svg>
    </div>
  )
}
