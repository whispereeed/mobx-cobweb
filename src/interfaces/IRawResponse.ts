/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IType, PureCollection } from '../datx'

export const enum RESPONSE_DATATYPE {
  CREATION,
  COUNT,
  LIST,
  SINGLE,
  PAGE,
  ERROR,
  NONE,
  SINGLE_STATUS,
  SINGLE_DATA
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

export interface IRawResponse<D = IResponseData> {
  dataType?: RESPONSE_DATATYPE
  data?: D
  meta?: Record<string, string>
  modelType?: IType
  collection?: PureCollection
  error?: Error
  headers?: Headers
  responseHeaders?: Headers
  requestHeaders?: Record<string, string>
  status?: number
}
