/***************************************************
 * Created by nanyuantingfeng on 2020/7/22 21:32. *
 ***************************************************/
import { IType, Attribute, PureModel } from '@issues-beta/datx'

export function identifier<T extends PureModel>(obj: T, key: string, opts?: object): void {
  return Attribute({ isIdentifier: true })(obj, key, opts)
}

export function property<T extends PureModel>(obj: T, key: string, opts?: object): void {
  return Attribute()(obj, key, opts)
}

export function referenceOne(refModel: typeof PureModel | IType): (obj: PureModel, key: string) => void {
  return Attribute({ toOne: refModel })
}

export function referenceMany(refModel: typeof PureModel | IType, property?: string): (obj: PureModel, key: string) => void {
  return Attribute({ toMany: refModel, referenceProperty: property })
}

export function propertyDefaultValue(value: any): (obj: PureModel, key: string) => void {
  return Attribute({ defaultValue: value })
}

export function propertyType<T extends PureModel>(obj: T, key: string, opts?: object): void {
  return Attribute({ isType: true })(obj, key, opts)
}
