/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IHeaders } from './types'
import { IResponseHeaders } from './IResponseHeaders'
import { IRawData } from './IRawData'
import { ISkeletonCollection } from './ISkeletonCollection'

export interface IRawResponse {
  data?: IRawData
  collection?: ISkeletonCollection
  error?: Error
  headers?: IResponseHeaders
  requestHeaders?: IHeaders
  status?: number
}
