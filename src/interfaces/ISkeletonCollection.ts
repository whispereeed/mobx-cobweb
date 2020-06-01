/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IModelConstructor, IType, PureCollection, PureModel } from 'datx'

import { ISkeletonModel } from './ISkeletonModel'
import { IRequestOptions } from './IRequestOptions'
import { IRawData } from './IRawData'
import { ResponseView } from '..'

export interface ISkeletonCollection extends PureCollection {
  sync<T extends ISkeletonModel>(data?: IRawData<object[]>): T[]
  sync<T extends ISkeletonModel>(data?: IRawData<object>): T
  sync<T extends ISkeletonModel>(type: IModelConstructor<T> | IType, data: object[]): T[]
  sync<T extends ISkeletonModel>(type: IModelConstructor<T> | IType, data: object): T

  fetch<T extends ISkeletonModel>(
    type: IType | T | IModelConstructor<T>,
    options?: IRequestOptions
  ): Promise<ResponseView<T[]>>

  fetch<T extends ISkeletonModel>(
    type: IType | T | IModelConstructor<T>,
    ids: undefined | null,
    options?: IRequestOptions
  ): Promise<ResponseView<T[]>>

  fetch<T extends ISkeletonModel>(
    type: IType | T | IModelConstructor<T>,
    id?: IIdentifier,
    options?: IRequestOptions
  ): Promise<ResponseView<T>>

  fetch<T extends ISkeletonModel>(
    type: IType | T | IModelConstructor<T>,
    ids?: IIdentifier[],
    options?: IRequestOptions
  ): Promise<ResponseView<T[]>>

  removeOne(type: IType | typeof PureModel, id: IIdentifier, remote?: boolean | IRequestOptions): Promise<void>
  removeOne(model: PureModel, remote?: boolean | IRequestOptions): Promise<void>
}
