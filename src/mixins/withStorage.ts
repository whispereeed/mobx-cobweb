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

export interface IStorageConfig {
  storageKey?: string
  enableZip?: boolean
  storage?: {
    getItem<T>(key: string): string | Promise<T> | null
    setItem<T>(key: string, value: T): void | Promise<T>
  }
}

function withStorageCollection<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithLocalStorage extends BaseClass implements IStorageCollectionMixin<T> {
    static storageConfig: IStorageConfig = {
      storageKey: '__COBWEB_MODELS_',
      enableZip: false,
      storage: localStorage as any
    }

    load() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageConfig: IStorageConfig }
      const { enableZip, storageKey, storage } = {
        ...WithLocalStorage.storageConfig,
        ...StaticCollection.storageConfig
      }

      Promise.resolve(storage.getItem<string>(storageKey))
        .then((data) => {
          if (data) {
            if (enableZip) data = LZ.decompress(data)
            this.insert(JSON.parse(data))
          }
        })
        .catch((e) => {
          console.warn(`load local cache data fail. ${e}`)
        })

      return this
    }

    recording() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageConfig: IStorageConfig }
      const { enableZip, storageKey, storage } = {
        ...WithLocalStorage.storageConfig,
        ...StaticCollection.storageConfig
      }
      const types = StaticCollection.types.filter((Q: any) => !!Q.enableStorage)
      return autorun(() => {
        const models = types.reduce((oo, type) => oo.concat(this.findAll(type).map(modelToJSON)), [])
        let data = JSON.stringify(models)
        if (enableZip) data = LZ.compress(data)
        storage.setItem<string>(storageKey, data)
      })
    }
  }

  return (WithLocalStorage as unknown) as ICollectionConstructor<IStorageCollectionMixin<T> & T> & {
    storageConfig: IStorageConfig
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
  storageConfig: IStorageConfig
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
