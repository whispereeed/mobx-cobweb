/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IRawData } from './IRawData'
import { PureCollection } from 'datx'
import { IDictionary } from 'datx-utils'

export interface IRawResponse<D> {
  data?: IRawData<D>
  collection?: PureCollection
  error?: Error
  headers?: Headers
  requestHeaders?: IDictionary<string>
  status?: number
}
