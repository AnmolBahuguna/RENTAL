import React from 'react'
import { cn } from '../../utils/helpers'

export const Skeleton = ({ 
  className = '', 
  variant = 'rectangle', 
  width, 
  height 
}) => {
  const variants = {
    rectangle: 'rounded-xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  }

  return (
    <div 
      className={cn(
        'skeleton', // from index.css
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  )
}
