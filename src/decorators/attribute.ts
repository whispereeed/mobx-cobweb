/***************************************************
 * Created by nanyuantingfeng on 2020/7/22 21:32. *
 ***************************************************/
import { IType, prop, PureModel } from 'datx'

export const attribute = prop

export function identifier<T extends PureModel>(obj: T, key: string, opts?: object): void {
  return prop.identifier(obj, key, opts)
}

export function property<T extends PureModel>(obj: T, key: string, opts?: object): void {
  return prop(obj, key, opts)
}

export function referenceOne(refModel: typeof PureModel | IType): (obj: PureModel, key: string) => void {
  return attribute.toOne(refModel)
}

export function referenceMany(refModel: typeof PureModel | IType, property?: string): (obj: PureModel, key: string) => void {
  return attribute.toMany(refModel, property)
}

export function propertyDefaultValue(value: any): (obj: PureModel, key: string) => void {
  return attribute.defaultValue(value)
}

export function propertyType<T extends PureModel>(obj: T, key: string, opts?: object): void {
  return attribute.type(obj, key, opts)
}
