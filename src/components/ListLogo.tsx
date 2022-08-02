import React from 'react'

import uriToHttp from '@/src/utils/uriToHttp'

export default function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string
  size?: string
  style?: React.CSSProperties
  alt?: string
}) {
  const srcs: string[] = uriToHttp(logoURI)

  return <img alt={alt} className="w-10 h-20 rounded-full" src={srcs[0]} style={style} />
}
