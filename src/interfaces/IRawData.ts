/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IDictionary } from 'datx-utils'
import { IHeaders } from './types'
import { IType } from 'datx'
import { IResponseHeaders } from './IResponseHeaders'

export interface IRawData<D = any> {
  type: IType
  data?: D
  meta?: IDictionary
}

export interface IResponseData<D = any> {
  data?: D
  meta?: IDictionary
  error?: Error
  headers?: IResponseHeaders
  requestHeaders?: IHeaders
  status?: number
}
