/***************************************************
 * Created by nanyuantingfeng on 2019/11/27 16:24. *
 ***************************************************/
export type $ElementType<T extends { [P in K & any]: any }, K extends keyof T | number> = T[K]
export type $PickOf<T, X, Y> = T extends any[] ? X : Y

export interface INestedArray<T> extends Array<T | INestedArray<T>> {}

export type IOneOrMany<T> = T | T[]
