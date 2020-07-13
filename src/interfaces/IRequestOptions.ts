/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { INestedArray } from './types'
import { IDictionary } from 'datx-utils'

export type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface IRequestOptions {
  headers?: IDictionary<string>

  // body
  data?: any

  // selector
  selector?: {
    filters?: string | string[]
    orders?: string[]
    limit?: [number, number]
    select?: string | INestedArray<string>
  }

  // qs
  params?: IDictionary<string>

  // url fix
  action?: string | ((url: string) => string)

  method?: IRequestMethod

  skipCache?: boolean
}
