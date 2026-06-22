import React, { useEffect, useState } from 'react'
import { resolveMediaUrl } from '../../api'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(!props.src)

  useEffect(() => {
    setDidError(!props.src)
  }, [props.src])

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setDidError(true)
    props.onError?.(event)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-[#0a0800] text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img className="max-w-[55%] max-h-[55%] opacity-60" src={ERROR_IMG_SRC} alt="Product image unavailable" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={resolveMediaUrl(src)} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
