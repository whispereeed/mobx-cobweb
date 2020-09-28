/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { INestedArray } from './types'

export type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface IRequestOptions {
  headers?: Record<string, string>

  // body data
  data?: object

  // selector
  selector?: {
    filters?: string | string[]
    orders?: string[]
    limit?: [number, number]
    select?: string | INestedArray<string>
  }
  // qs
  params?: Record<string, string | number | boolean>
  // url fix
  action?: string | ((url: string) => string)

  method?: IRequestMethod

  skipCache?: boolean

  skipRevert?: boolean
}
