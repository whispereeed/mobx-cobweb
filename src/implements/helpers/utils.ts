declare var window: { window: any }

export const isBrowser: boolean = typeof window !== 'undefined' && window.window === window

/**
 * Returns the value if it's not a function. If it's a function
 * it calls it.
 *
 * @export
 * @template T
 * @param {(T|(() => T))} target can be  anything or function
 * @returns {T} value
 */
export function getValue<T>(target: T | (() => T)): T {
  if (typeof target === 'function') {
    return (target as Function)()
  }

  return target
}

export function error(message: string): Error {
  return new Error(`[datx exception] ${message}`)
}
