/***************************************************
 * Created by nanyuantingfeng on 2020/7/27 16:40. *
 ***************************************************/
import { ICollectionConstructor, PureCollection, PureModel, IModelConstructor, isCollection, isModel } from '../datx'
import { IStorageMixin, IStorageType } from '../interfaces/IStorageMixin'
import { error } from '../helpers/utils'
import { withStorageForCollection } from './withStorageForCollection'
import { withStorageForModel } from './withStorageForModel'

export function withStorage<T extends PureCollection>(
  Base: ICollectionConstructor<T>
): ICollectionConstructor<IStorageMixin<T> & T> & {
  storage: IStorageType
}

export function withStorage<T extends PureModel>(
  Base: IModelConstructor<T>
): IModelConstructor<T> & {
  enableStorage: boolean
}

export function withStorage(Base: any) {
  if (isCollection(Base)) {
    return withStorageForCollection(Base as typeof PureCollection)
  }

  if (isModel(Base)) {
    return withStorageForModel(Base as typeof PureModel)
  }

  throw error(`withStorage is a mixin for Collection or Model.`)
}
