/***************************************************
 * Created by nanyuantingfeng on 2019/11/27 16:24. *
 ***************************************************/
import { IDictionary } from 'datx-utils'
import { IIdentifier } from 'datx'
type ValuesType<T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>> = T extends ReadonlyArray<any> ? T[number] : T extends ArrayLike<any> ? T[number] : T extends object ? T[keyof T] : never;
export type $PickElementType<T> = T extends any[] ? ValuesType<T> : T
export type $PickReturnType<T, X, Y> = T extends any[] ? X : Y
export type $PickReturnSingleOrMulti<T, X> = $PickReturnType<T, X[], X>

export interface INestedArray<T> extends Array<T | INestedArray<T>> {}

export interface IDefinition {
  id?: IIdentifier
  type: string
}

export interface IError {
  id?: string | number
  status?: number
  code?: string
  title?: string
  detail?: string
}

export type IHeaders = IDictionary<string>
