/***************************************************
 * Created by nanyuantingfeng on 2020/8/21 11:09. *
 ***************************************************/
import { observable, action, _allowStateChanges } from 'mobx'

export interface IDataRef<T, E = any> {
  current: T
  refresh(): T
  reset(): T
  pending: boolean
  onerror: (e: E) => void
}

export function createDataRef<T, E = any>(
  fetch: (update: (newValue: T) => void, error?: (e: E) => void) => void,
  initialValue?: T
): IDataRef<T, E> {
  let started = false
  const value = observable.box<T>(initialValue, { deep: false })
  const pending = observable.box(false)
  let errorFn = (_: E) => {}

  const currentFn = () => {
    if (!started) {
      started = true
      _allowStateChanges(true, () => pending.set(true))
      fetch(
        (newValue: T) => {
          _allowStateChanges(true, () => {
            value.set(newValue)
            pending.set(false)
          })
        },
        (e: E) => {
          pending.set(false)
          errorFn(e)
        }
      )
    }
    return value.get()
  }
  const resetFn = action('createDataRef:reset', () => {
    started = false
    value.set(initialValue)
    return value.get()
  })

  return {
    get current() {
      return currentFn()
    },
    refresh: () => {
      if (started) {
        started = false
        return currentFn()
      } else {
        return value.get()
      }
    },
    reset: resetFn,
    get pending() {
      return pending.get()
    },
    set onerror(fn: (e: E) => void) {
      errorFn = fn
    }
  }
}
