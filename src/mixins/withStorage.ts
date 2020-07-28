/***************************************************
 * Created by nanyuantingfeng on 2020/7/27 16:40. *
 ***************************************************/
import {
  ICollectionConstructor,
  modelToJSON,
  PureCollection,
  PureModel,
  IModelConstructor,
  isCollection,
  isModel
} from '../datx'
import { autorun } from 'mobx'
import LZ from 'lz-string'
import { IStorageCollectionMixin } from '../interfaces/IStorageCollectionMixin'
import { error } from '../helpers/utils'

function withStorageCollection<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithLocalStorage extends BaseClass implements IStorageCollectionMixin<T> {
    static storageKey = '__COBWEB_MODELS_'

    public load() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageKey: string }
      const persistKey = StaticCollection.storageKey
      const data = localStorage.getItem(persistKey)
      if (!data) return this
      this.insert(JSON.parse(LZ.decompress(data)))
      return this
    }

    public recording() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageKey: string }
      const storageKey = StaticCollection.storageKey
      const types = StaticCollection.types.filter(
        (Q: typeof PureModel & { enableStorage: boolean }) => !!Q.enableStorage
      )

      return autorun(() => {
        const models = types.reduce((oo, type) => oo.concat(this.findAll(type).map(modelToJSON)), [])
        const data = LZ.compress(JSON.stringify(models))
        localStorage.setItem(storageKey, data)
      })
    }
  }

  return (WithLocalStorage as unknown) as ICollectionConstructor<IStorageCollectionMixin<T> & T> & {
    storageKey: string
  }
}

function withStorageModel<T extends PureModel>(Base: IModelConstructor<T>) {
  const BaseClass = Base as typeof PureModel

  return BaseClass as IModelConstructor<T> & {
    enableStorage: boolean
  }
}

export function withStorage<T extends PureCollection>(
  Base: ICollectionConstructor<T>
): ICollectionConstructor<IStorageCollectionMixin<T> & T> & {
  storageKey: string
}

export function withStorage<T extends PureModel>(
  Base: IModelConstructor<T>
): IModelConstructor<T> & {
  enableStorage: boolean
}

export function withStorage(Base: any) {
  if (isCollection(Base)) {
    return withStorageCollection(Base as typeof PureCollection)
  }

  if (isModel(Base)) {
    return withStorageModel(Base as typeof PureModel)
  }

  throw error(`withStorage is a mixin for Collection or Model.`)
}
