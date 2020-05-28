/***************************************************
 * Created by nanyuantingfeng on 2019/11/27 16:24. *
 ***************************************************/
import { IDictionary } from 'datx-utils'
export type $ElementOf<T> = T extends Array<infer E> ? E : T

export interface INestedArray<T> extends Array<T | INestedArray<T>> {}

export interface IError {
  id?: string | number
  status?: number
  code?: string
  title?: string
  detail?: string
}

export type IHeaders = IDictionary<string>
