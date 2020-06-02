/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IHeaders } from './types'
import { IResponseHeaders } from './IResponseHeaders'
import { IRawData } from './IRawData'
import { PureCollection } from 'datx'

export interface IRawResponse<D> {
  data?: IRawData<D>
  collection?: PureCollection
  error?: Error
  headers?: IResponseHeaders
  requestHeaders?: IHeaders
  status?: number
}
