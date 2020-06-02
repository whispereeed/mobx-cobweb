/***************************************************
 * Created by nanyuantingfeng on 2019/11/27 16:24. *
 ***************************************************/
export type $ElementOf<T> = T extends Array<infer E> ? E : T
export type $PickOf<T, X, Y> = T extends Array<infer E> ? X : Y

export interface INestedArray<T> extends Array<T | INestedArray<T>> {}

export interface IError {
  id?: string | number
  status?: number
  code?: string
  title?: string
  detail?: string
}

export type IHeaders = Record<string, string>
