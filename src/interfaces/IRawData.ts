/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IType } from '@issues-beta/datx'

export interface IRawData<D> {
  type: IType
  data?: D
  meta?: Record<string, any>
}

export interface IResponseData<D = any> {
  data?: D
  meta?: Record<string, any>
  error?: Error
  headers?: Headers
  requestHeaders?: Record<string, string>
  status?: number
}
