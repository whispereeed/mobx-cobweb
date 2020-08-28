/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IType, PureCollection } from '../datx'
import { IRawModel } from 'datx-utils'

export const enum RESPONSE_DATATYPE {
  CREATION = 'CREATION',
  COUNT = 'COUNT',
  LIST = 'LIST',
  SINGLE = 'SINGLE',
  PAGE = 'PAGE',
  ERROR = 'ERROR',
  NONE = 'NONE',
  SINGLE_STATUS = 'SINGLE_STATUS',
  SINGLE_DATA = 'SINGLE_DATA'
}

export interface ICreationResponseData {
  id: string
}
export interface ICountResponseData {
  count: number
}
export interface IListResponseData<T = any> {
  items: T[]
}
export interface ISingleResponseData<T = any> {
  value: T
}
export interface IPageResponseData<T = any> {
  count: number
  items: T[]
}
export interface IErrorResponseData {
  code: number
  data: any
  errorCode: number
  errorMessage: string
}

export type IResponseData =
  | ICreationResponseData
  | ICountResponseData
  | IListResponseData
  | ISingleResponseData
  | IPageResponseData
  | IErrorResponseData
  | null

export interface IRawResponse {
  dataType?: RESPONSE_DATATYPE
  data?: IRawModel | IRawModel[] | null
  meta?: Record<string, any>
  modelType?: IType
  collection?: PureCollection
  error?: any
  headers?: Headers
  responseHeaders?: Headers
  requestHeaders?: Record<string, string>
  status?: number
}
