import React, {
  cloneElement
} from 'react'
import { ThemeProvider } from './client'
import type { CSSProperties, HTMLProps, ReactElement, ReactNodeArray } from 'react'
import type { ThemeProviderProps } from './types'

const colorSchemes = ['light', 'dark']
const defaultThemes = ['light', 'dark']
const isServer = typeof window === 'undefined'

let Cookies: {
  get: (name: string) => string | null;
  set: (name: string, value: unknown, options: Record<string, unknown>) => void;
}
try {
  if (isServer) Cookies = require('next/headers').cookies()
} catch(e) { 
  Cookies = { get: (_: string) => null, set: (..._) => null }
}

// Properties for rendering <html> on the server in a way that will match client after hydration
const getThemeHtmlProps = ({
  attribute = 'data-theme',
  cookieName = '',
  defaultTheme = 'light',
  enableColorScheme = true,
  value,
}: ThemeProviderProps) => {
  const props: HTMLProps<HTMLHtmlElement> = {}

  const resolved = Cookies.get(cookieName) || defaultTheme
  const name = value ? value[resolved] : resolved

  if (attribute === 'class') {
    if (name) props.className = name
  } else {
    (props as Record<string, string>)[attribute] = name
  }

  if (enableColorScheme) {
    const fallback = colorSchemes.includes(defaultTheme) ? defaultTheme : null
    const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback
    props.style = { colorScheme } as CSSProperties
  }

  return props
}

// Wraps an <html> element on the server to apply themes before reaching the client
export const ServerThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }) => {
  if (!children || (children as ReactElement).type !== 'html') {
    throw new Error('<ServerThemeProvider> must contain the <html> element.')
  }
  const child = children as ReactElement
  const original = child.props
  const resolved = getThemeHtmlProps(props)
  if (original.className && resolved.className) {
    resolved.className = `${original.className} ${resolved.className}`
  }
  if (original.style && resolved.style) {
    let originalStyle = original.style
    if (typeof originalStyle === 'string') {
      originalStyle = Object.fromEntries(originalStyle.split(/;\s*/).map(x => x.split(/\s*:\s*/)))
    }
    resolved.style = {
      ...resolved.style,
      ...originalStyle,
    }
  }

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
  // const attrs = !props.value ? (props.themes || defaultThemes) : Object.values(props.value)
  // const defaultTheme = props.enableSystem !== false ? 'system' : 'light'
  const {
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = true,
    storageKey = 'theme',
    cookieName,
    themes = defaultThemes,
    defaultTheme = enableSystem ? 'system' : 'light',
    attribute = 'data-theme',
    value,
    nonce
  } = props
  resolved.children = [
    ...newKids.slice(0, bodyIndex),
    cloneElement(body, {
      children: [
        ...bodyChildren,
        <ThemeProvider {...{
          forcedTheme,
          disableTransitionOnChange,
          enableSystem,
          enableColorScheme,
          storageKey,
          cookieName,
          themes,
          defaultTheme,
          attribute,
          value,
          children,
          nonce
        }} />
        // <ThemeScript {...{
        //   attrs,
        //   defaultTheme,
        //   disableTransitionOnChange: false,
        //   enableSystem: true,
        //   enableColorScheme: true,
        //   storageKey: 'theme',
        //   themes: defaultThemes,
        //   attribute: 'data-theme',
        //   ...props,
        // }} />,
      ]
    }),
    ...newKids.slice(bodyIndex),
  ]

  return cloneElement(child, resolved)
}