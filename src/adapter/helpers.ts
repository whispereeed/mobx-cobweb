/***************************************************
 * Created by nanyuantingfeng on 2019/11/28 17:44. *
 ***************************************************/
import { $ElementType, IRequestOptions, IOneOrMany } from '../interfaces'
import { IIdentifier } from '../datx'
import { isArrayLike } from 'mobx'

interface IQueryParamOrder {
  value: string
  order: 'ASC' | 'DESC'
}

interface IQueryParamLimit {
  start: number
  count: number
}

interface IQueryParams {
  orderBy?: IQueryParamOrder[]
  limit?: IQueryParamLimit
  filterBy?: string
  select?: string
}

type ISelector = $ElementType<IRequestOptions, 'selector'>

const URL_REGEX = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/

function prepareFilters(filters: $ElementType<$ElementType<IRequestOptions, 'selector'>, 'filters'>): string {
  if (!filters) return undefined
  const filters2 = isArrayLike(filters) ? filters : [filters]
  return filters2.join('&&')
}

function prepareOrders(orders?: $ElementType<ISelector, 'orders'>): IQueryParamOrder[] {
  if (!orders) return undefined
  return orders.map((key) => {
    let oo = { value: key, order: 'ASC' }
    if (key.endsWith('!')) {
      oo = { value: key.slice(0, -1), order: 'DESC' }
    }
    return oo
  }) as IQueryParamOrder[]
}

function prepareSelect(select: $ElementType<ISelector, 'select'>): string {
  if (!select) return undefined
  if (typeof select === 'string') return select

  return select
    .map((k) => {
      if (k === '...') {
        return '`...`'
      }
      if (isArrayLike(k)) {
        return `${k.shift()}(${prepareSelect(k)})`
      }
      return k
    })
    .join(',')
}

function prepareLimit(limit: $ElementType<ISelector, 'limit'>): IQueryParamLimit {
  if (!limit) return undefined
  return { start: limit[0], count: limit[1] }
}

export function prepareURL(endpoint: string, ids?: IOneOrMany<IIdentifier>) {
  if (ids != undefined) endpoint += isArrayLike(ids) ? `/[${ids.join(',')}]` : `/\$${ids}`
  return endpoint
}

export function prepareQS(params: $ElementType<IRequestOptions, 'params'>): string {
  if (!params) return undefined
  return Object.keys(params)
    .map((k) => `${k}=${params[k]}`)
    .join('&')
}

export function prefixURL(url: string, baseURL: string, action?: string | ((url: string) => string)) {
  if (!action) action = ''
  let oo: string
  if (typeof action === 'string') {
    oo = URL_REGEX.test(url) ? `${url}///${action}` : `${baseURL}///${url}///${action}`
    oo = oo.replace(/[/]{3,}/g, '/')
    if (oo.endsWith('/')) oo = oo.slice(0, -1)
  } else if (typeof action === 'function') {
    oo = URL_REGEX.test(url) ? `${url}` : `${baseURL}///${url}`
    oo = oo.replace(/[/]{3,}/g, '/')
    oo = action(oo)
  }
  return oo
}

export function appendParams(url: string, qs: string): string {
  let newUrl = url
  if (qs && qs.length) {
    const separator = newUrl.indexOf('?') === -1 ? '?' : '&'
    newUrl += separator + qs
  }
  return newUrl
}

export function prepareSelector(selector: ISelector): IQueryParams {
  return {
    filterBy: prepareFilters(selector.filters),
    orderBy: prepareOrders(selector.orders),
    select: prepareSelect(selector.select),
    limit: prepareLimit(selector.limit)
  }
}
