declare var window: { window: any }

export const isBrowser: boolean = typeof window !== 'undefined' && window.window === window

export function getValue<T>(target: T | (() => T), ...params: any[]): T {
  if (typeof target === 'function') {
    return (target as Function)(...params)
  }
  return target
}

export function error(message: string): Error {
  return new Error(`[mobx-cobweb exception] ${message}`)
}

export function isEmptyObject(obj: any) {
  if (obj === null || obj === undefined || Array.isArray(obj) || typeof obj !== 'object') {
    return true
  }

  return Object.getOwnPropertyNames(obj).length === 0
}

export function peekNonNullish(...args: any[]): any {
  if (args.length === 0) return null

  let i = -1
  while (++i < args.length) {
    let arg = args[i]

    if (typeof arg === 'function') {
      arg = arg()
    }
    if (arg !== null && arg !== undefined) {
      return arg
    }
  }
  return null
}

export function isPlainObject(obj: any) {
  return !!obj && Object.prototype.toString.call(obj) === '[object Object]'
}

export function isIdentifier(obj: any) {
  return typeof obj === 'string' || typeof obj === 'number'
}
