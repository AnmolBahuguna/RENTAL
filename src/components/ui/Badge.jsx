import React from 'react'
import { cn } from '../../utils/helpers'

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default:  'bg-gray-100 text-gray-700',
    brand:    'bg-brand-100 text-brand-700',
    accent:   'bg-accent-100 text-accent-700',
    success:  'bg-green-100 text-green-700',
    warning:  'bg-yellow-100 text-yellow-700',
    danger:   'bg-red-100 text-red-700',
    purple:   'bg-purple-100 text-purple-700',
  }
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}

export const TypeBadge = ({ type }) => {
  const map = {
    Room:   { variant: 'brand',   icon: '🛏️' },
    Flat:   { variant: 'success', icon: '🏢' },
    Hostel: { variant: 'warning', icon: '🏨' },
    PG:     { variant: 'purple',  icon: '🏠' },
  }
  const { variant = 'default', icon = '📌' } = map[type] || {}
  return <Badge variant={variant}>{icon} {type}</Badge>
}
