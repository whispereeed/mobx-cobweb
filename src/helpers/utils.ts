declare var window: { window: any }

export const isBrowser: boolean = typeof window !== 'undefined' && window.window === window

export function getValue<T>(target: T | (() => T)): T {
  if (typeof target === 'function') {
    return (target as Function)()
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
