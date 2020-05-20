/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import {
  ICollectionConstructor,
  IModelConstructor,
  isCollection,
  isModel,
  isView,
  IViewConstructor,
  PureCollection,
  PureModel,
  View
} from 'datx'

import { decorateCollection } from './implements/decorateCollection'
import { decorateModel } from './implements/decorateModel'
import { decorateView } from './implements/decorateView'
import { ISkeletonCollection, ISkeletonModel, ISkeletonModelConstructor, ISkeletonView } from './interfaces'

export function skeleton<T extends PureModel>(
  BaseClass: IModelConstructor<T>
): ISkeletonModelConstructor<T & ISkeletonModel>

export function skeleton<T extends PureCollection>(
  BaseClass: ICollectionConstructor<T>
): ICollectionConstructor<T & ISkeletonCollection>

export function skeleton<T extends ISkeletonModel>(
  BaseClass: IViewConstructor<T> | typeof View
): IViewConstructor<T, ISkeletonView<T>>

export function skeleton<T>(BaseClass: IModelConstructor<T> | ICollectionConstructor<T> | IViewConstructor<T>) {
  if (isModel(BaseClass)) {
    return decorateModel((BaseClass as unknown) as typeof PureModel)
  } else if (isCollection(BaseClass)) {
    return decorateCollection((BaseClass as unknown) as typeof PureCollection)
  } else if (isView(BaseClass)) {
    return decorateView<T>((BaseClass as unknown) as typeof View)
  }

  throw new Error('The instance needs to be a model, collection or a view')
}
