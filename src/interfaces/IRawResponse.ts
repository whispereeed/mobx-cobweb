/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IRawModel, IType, PureCollection } from '../datx'
import { IOneOrMany } from './types'

export interface IRawResponse<D = IOneOrMany<IRawModel>> {
  data?: D
  modelType?: IType
  meta?: Record<string, any>
  collection?: PureCollection
  error?: Error
  headers?: Headers
  requestHeaders?: Record<string, string>
  status?: number
}
