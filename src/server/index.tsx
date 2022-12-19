import React, {
  cloneElement
} from 'react'
import type { ReactElement, ReactNodeArray } from 'react'
import type { ThemeProviderProps } from '../types'

const ThemeProvider = require('../client').ThemeProvider as React.FC<ThemeProviderProps>

// Wraps an <html> element on the server to apply themes before reaching the client
export const ServerThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }) => {
  if (!children || (children as ReactElement).type !== 'html') {
    throw new Error('<ServerThemeProvider> must contain the <html> element.')
  }
  const child = children as ReactElement
  const original = child.props
  const resolved = { ...original, suppressHydrationWarning: true }

  let newKids: ReactNodeArray
  if (!original.children) {
    newKids = []
  } else if (!Array.isArray(original.children)) {
    newKids = [original.children]
  } else {
    newKids = [...original.children]
  }
  let bodyIndex = newKids.findIndex(x => x && typeof x === 'object' && (x as ReactElement).type === 'body')
  let body: ReactElement
  if (bodyIndex !== -1) {
    body = newKids.splice(bodyIndex, 1)[0] as ReactElement
  } else {
    bodyIndex = newKids.length
    body = <body />
  }
  let bodyChildren: ReactNodeArray
  if (!body.props?.children) {
    bodyChildren = []
  } else if (!Array.isArray(body.props.children)) {
    bodyChildren = [body.props.children]
  } else {
    bodyChildren = [...body.props.children]
  }
  resolved.children = [
    ...newKids.slice(0, bodyIndex),
    cloneElement(body, {
      // children: bodyChildren,
      children: <ThemeProvider {...props}>{bodyChildren}</ThemeProvider>
    }),
    ...newKids.slice(bodyIndex),
  ]

  return cloneElement(child, resolved)
}
