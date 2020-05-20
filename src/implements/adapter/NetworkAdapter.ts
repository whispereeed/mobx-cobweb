/***************************************************
 * Created by nanyuantingfeng on 2019/11/28 17:24. *
 ***************************************************/
import { IIdentifier, IType } from 'datx'
import { IDictionary } from 'datx-utils'
import { IHeaders, INetworkAdapter, IRequestOptions, IResponseData, IResponseHeaders } from '../../interfaces'
import { appendParams, prefixURL, prepareQS, prepareSelector, prepareURL } from './helpers'
import { isBrowser } from '../helpers/utils'

export class NetworkAdapter implements INetworkAdapter {
  constructor(public baseUrl: string, public fetchReference?: typeof fetch) {
    if (!fetchReference) {
      if (isBrowser) {
        this.fetchReference = window.fetch
      } else {
        throw new Error('Fetch reference needs to be defined before using the network')
      }
    }
  }

  defaultFetchOptions = {
    headers: {
      'content-type': 'application/json'
    }
  }

  prepare(props: {
    type: IType
    endpoint: string
    ids?: IIdentifier | IIdentifier[]
    options?: IRequestOptions
    method?: string
  }): { url: string; options?: any; cacheKey: string } {
    const options = props.options || {}

    const url = prepareURL(props.endpoint, props.type, props.ids)
    const fixedURL = appendParams(prefixURL(url, this.baseUrl), prepareQS(options.params))

    const requestHeaders: IDictionary<string> = options.headers || {}
    let uppercaseMethod = props.method.toUpperCase()
    let body = options.data
    let cacheKey = undefined

    if (uppercaseMethod === 'GET' && options.selector) {
      const selectBody = prepareSelector(options.selector)

      const selectBodyString = JSON.stringify(selectBody)
      if (selectBodyString !== '{}') {
        // If it's a `selector` call, switch to the `POST` procedure
        // to ensure the parameter integrity of the `body`
        uppercaseMethod = 'POST'
        body = { ...body, ...selectBody }
      }

      cacheKey = fixedURL + ':' + selectBodyString
    }

    const isBodySupported = uppercaseMethod !== 'GET' && uppercaseMethod !== 'HEAD'
    const defaultHeaders = this.defaultFetchOptions.headers || {}
    const reqHeaders: IHeaders = Object.assign({}, defaultHeaders, requestHeaders) as IHeaders

    const options2 = Object.assign({}, this.defaultFetchOptions, {
      body: (isBodySupported && JSON.stringify(body)) || undefined,
      headers: reqHeaders,
      method: uppercaseMethod
    })

    return { url: fixedURL, options: options2, cacheKey }
  }

  fetch(url: string, options: any): Promise<IResponseData> {
    let status: number
    let headers: IResponseHeaders
    const request: Promise<void> = Promise.resolve()
    const requestHeaders = options.headers
    return request
      .then(() => this.fetchReference(url, options))
      .then((response: Response) => {
        status = response.status
        headers = response.headers
        return response.json()
      })
      .catch((error: Error) => {
        if (status === 204) {
          return null
        }

        throw error
      })
      .then((responseData: any) => {
        let result: IResponseData = {}

        if (responseData.value) {
          result.data = responseData.value
        }

        if (responseData.items && Array.isArray(responseData.items)) {
          result.data = responseData.items
          result.meta = { count: responseData.count }
        }

        if (status >= 400) {
          throw { message: `Invalid HTTP status: ${status}`, status }
        }

        return { data: result, headers, requestHeaders, status }
      })
      .catch(error => {
        return this.onError({ error, headers, requestHeaders, status })
      })
  }

  onError(error: IResponseData) {
    return error
  }
}
