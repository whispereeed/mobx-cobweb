/***************************************************
 * Created by nanyuantingfeng on 2020/8/6 19:23. *
 ***************************************************/
import { autorun } from 'mobx'
import { ICollectionConstructor, modelToJSON, PureCollection } from '../datx'
import { IStorageMixin, IStorageConfig } from '../interfaces/IStorageMixin'

export function withStorageForCollection<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithLocalStorage extends BaseClass implements IStorageMixin<T> {
    static storageConfig: IStorageConfig = {
      storageKey: '__COBWEB_MODELS_'
    }

    async load() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageConfig: IStorageConfig }
      const { storageKey, storage } = {
        ...WithLocalStorage.storageConfig,
        ...StaticCollection.storageConfig
      }

      if (!storage) return

      try {
        let data = await storage.getItem(storageKey)
        if (data) {
          this.insert(JSON.parse(data))
        }
      } catch (e) {
        console.warn(`load local cache data fail. ${e}`)
      }
    }

    recording() {
      const StaticCollection = this.constructor as typeof PureCollection & { storageConfig: IStorageConfig }
      const { storageKey, storage } = {
        ...WithLocalStorage.storageConfig,
        ...StaticCollection.storageConfig
      }
      if (!storage) return () => {}
      const types = StaticCollection.types.filter((Q: any) => !!Q.enableStorage)
      return autorun(() => {
        const models = types.reduce((oo, type) => oo.concat(this.findAll(type).map(modelToJSON)), [])
        let data = JSON.stringify(models)
        storage.setItem(storageKey, data)
      })
    }
  }

  return (WithLocalStorage as unknown) as ICollectionConstructor<IStorageMixin<T> & T> & {
    storageConfig: IStorageConfig
  }
}
