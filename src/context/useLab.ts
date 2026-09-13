import { useContext } from 'react'
import { LabContext, type LabContextType } from './LabContext'

export const useLab = (): LabContextType => {
  const context = useContext(LabContext)
  if (!context) {
    throw new Error('useLab must be used within a LabProvider')
  }
  return context
}
