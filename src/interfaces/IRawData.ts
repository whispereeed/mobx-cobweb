/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IDictionary } from 'datx-utils'
import { IType } from 'datx'

export interface IRawData<D> {
  type: IType
  data?: D
  meta?: IDictionary
}

export interface IResponseData<D = any> {
  data?: D
  meta?: IDictionary
  error?: Error
  headers?: Headers
  requestHeaders?: IDictionary<string>
  status?: number
}
