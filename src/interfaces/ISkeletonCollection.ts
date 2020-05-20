/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IModelConstructor, IType, PureCollection, PureModel } from 'datx'

import { IResponseView } from './IResponseView'
import { ISkeletonModel } from './ISkeletonModel'
import { IRequestOptions } from './IRequestOptions'
import { IRawData } from './IRawData'
import { $PickElementType } from './types'

export interface ISkeletonCollection extends PureCollection {
  sync<T extends ISkeletonModel | ISkeletonModel[], D = T extends any[] ? any[] : any>(data?: IRawData<D>): T
  sync<T extends ISkeletonModel | ISkeletonModel[], D = T extends any[] ? any[] : any>(
    type: IType | IModelConstructor<$PickElementType<T>>,
    data: D
  ): T

  fetch<T extends ISkeletonModel = ISkeletonModel>(
    type: IType | IModelConstructor<T>,
    ids?: IIdentifier | IIdentifier[],
    options?: IRequestOptions
  ): Promise<IResponseView<T>>

  fetch<T extends ISkeletonModel = ISkeletonModel>(
    type: IType | IModelConstructor<T>,
    options?: IRequestOptions
  ): Promise<IResponseView<T>>

  removeOne(type: IType | typeof PureModel, id: IIdentifier, remote?: boolean | IRequestOptions): Promise<void>

  removeOne(model: PureModel, remote?: boolean | IRequestOptions): Promise<void>
}
