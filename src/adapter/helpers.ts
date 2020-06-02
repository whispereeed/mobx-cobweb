/***************************************************
 * Created by nanyuantingfeng on 2019/11/28 17:44. *
 ***************************************************/
import { INestedArray } from '../interfaces'
import { IIdentifier, IType } from 'datx'
import { IDictionary } from 'datx-utils'

interface IQueryParamOrder {
  value: string
  order: 'ASC' | 'DESC'
}

interface IQueryParamLimit {
  start: number
  count: number
}

interface IQueryParams {
  orderBy?: Array<IQueryParamOrder>
  limit?: IQueryParamLimit
  dims?: string
  filterBy?: string
  select?: string
}

const URL_REGEX = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/

function prepareFilters(filters: string | string[]): string {
  if (!filters) return undefined
  const filters2 = Array.isArray(filters) ? filters : [filters]
  return filters2.join('&&')
}

function prepareOrders(orders?: string[]): Array<IQueryParamOrder> {
  if (!orders) return undefined
  return orders.map((key) => {
    let oo = { value: key, order: 'ASC' }
    if (key.endsWith('!')) {
      oo = { value: key.slice(0, -1), order: 'DESC' }
    }
    return oo
  }) as Array<IQueryParamOrder>
}

function prepareSelect(select: string | INestedArray<string>): string {
  if (!select) return undefined
  if (typeof select === 'string') return select

  return select
    .map((k) => {
      if (k === '...') {
        return '`...`'
      }
      if (Array.isArray(k)) {
        return `${k.shift()}(${prepareSelect(k)})`
      }
      return k
    })
    .join(',')
}

function prepareLimit(limit: [number, number]): IQueryParamLimit {
  if (!limit) return undefined
  return { start: limit[0], count: limit[1] }
}

export function prepareURL(endpoint: string, type: IType, ids?: IIdentifier | IIdentifier[]) {
  if (ids) endpoint += Array.isArray(ids) ? `/[${ids.join(',')}]` : `/\$${ids}`
  return endpoint
}

export function prepareQS(params: IDictionary<string>): string {
  if (!params) return undefined
  return Object.keys(params)
    .map((k) => `${k}=${params[k]}`)
    .join('&')
}

export function prefixURL(url: string, baseURL: string) {
  if (URL_REGEX.test(url)) return url
  if (!baseURL.endsWith('/')) {
    baseURL += '/'
  }
  if (url.startsWith('/')) {
    url = url.slice(1)
  }
  return `${baseURL}${url}`
}

export function appendParams(url: string, qs: string): string {
  let newUrl = url
  if (qs && qs.length) {
    const separator = newUrl.indexOf('?') === -1 ? '?' : '&'
    newUrl += separator + encodeParam(qs)
  }
  return newUrl
}

export function encodeParam(param: string) {
  // Manually decode field-value separator (=)
  return encodeURIComponent(param).replace('%3D', '=')
}

export function prepareSelector(selector: any): IQueryParams {
  return {
    filterBy: prepareFilters(selector.filters),
    orderBy: prepareOrders(selector.orders),
    select: prepareSelect(selector.select),
    limit: prepareLimit(selector.limit),
    dims: selector.dims
  }
}
