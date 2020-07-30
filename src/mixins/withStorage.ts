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
import { IStorageMixin } from '../interfaces/IStorageMixin'
import { error } from '../helpers/utils'

export interface IStorageConfig {
  storageKey?: string
  enableZip?: boolean
  storage?: {
    getItem<T>(key: string): string | Promise<T> | null
    setItem<T>(key: string, value: T): Promise<T> | void
  }
}

function withStorageOnCollection<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithLocalStorage extends BaseClass implements IStorageMixin<T> {
    static storageConfig: IStorageConfig = {
      storageKey: '__COBWEB_MODELS_',
      enableZip: false
    }

    async load() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageConfig: IStorageConfig }
      const { enableZip, storageKey, storage } = {
        ...WithLocalStorage.storageConfig,
        ...StaticCollection.storageConfig
      }

      if (!storage) return

      try {
        let data = await storage.getItem<string>(storageKey)
        if (data) {
          if (enableZip) data = LZ.decompress(data)
          this.insert(JSON.parse(data))
        }
      } catch (e) {
        console.warn(`load local cache data fail. ${e}`)
      }
    }

    recording() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageConfig: IStorageConfig }
      const { enableZip, storageKey, storage } = {
        ...WithLocalStorage.storageConfig,
        ...StaticCollection.storageConfig
      }
      if (!storage) return () => {}
      const types = StaticCollection.types.filter((Q: any) => !!Q.enableStorage)
      return autorun(() => {
        const models = types.reduce((oo, type) => oo.concat(this.findAll(type).map(modelToJSON)), [])
        let data = JSON.stringify(models)
        if (enableZip) data = LZ.compress(data)
        storage.setItem<string>(storageKey, data)
      })
    }
  }

  return (WithLocalStorage as unknown) as ICollectionConstructor<IStorageMixin<T> & T> & {
    storageConfig: IStorageConfig
  }
}

function withStorageOnModel<T extends PureModel>(Base: IModelConstructor<T>) {
  const BaseClass = Base as typeof PureModel

  return BaseClass as IModelConstructor<T> & {
    enableStorage: boolean
  }
}

export function withStorage<T extends PureCollection>(
  Base: ICollectionConstructor<T>
): ICollectionConstructor<IStorageMixin<T> & T> & {
  storageConfig: IStorageConfig
}

export function withStorage<T extends PureModel>(
  Base: IModelConstructor<T>
): IModelConstructor<T> & {
  enableStorage: boolean
}

export function withStorage(Base: any) {
  if (isCollection(Base)) {
    return withStorageOnCollection(Base as typeof PureCollection)
  }

  if (isModel(Base)) {
    return withStorageOnModel(Base as typeof PureModel)
  }

  throw error(`withStorage is a mixin for Collection or Model.`)
}
