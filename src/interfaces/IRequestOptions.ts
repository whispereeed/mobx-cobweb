/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IHeaders } from './types'
import { INestedArray } from './types'
import { IDictionary } from 'datx-utils'

export interface IRequestOptions {
  headers?: IHeaders

  // body
  data?: any

  // selector
  selector?: {
    filters?: string | string[]
    orders?: string[]
    limit?: [number, number]
    select?: string | INestedArray<string>
    dims?: string
  }

  // qs
  params?: IDictionary<string>

  // action url
  url?: string

  // 'GET' | 'POST'
  method?: string

  skipCache?: boolean
}
