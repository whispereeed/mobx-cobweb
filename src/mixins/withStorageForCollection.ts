/***************************************************
 * Created by nanyuantingfeng on 2020/8/6 19:23. *
 ***************************************************/
import { autorun } from 'mobx'
import { ICollectionConstructor, modelToJSON, PureCollection } from '../datx'
import { IStorageMixin, IStorageType } from '../interfaces/IStorageMixin'

export function withStorageForCollection<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  const __S__ = { key: '__COBWEB_MODELS_' }

  class WithStorageForCollection extends BaseClass implements IStorageMixin<T> {
    async load() {
      const StaticCollection = this.constructor as typeof PureCollection & { storage: IStorageType }
      const { key, engine } = {
        ...__S__,
        ...StaticCollection.storage
      }

      if (!engine) return

      try {
        let data = await engine.getItem(key)
        if (data) {
          this.insert(JSON.parse(data))
        }
      } catch (e) {
        console.warn(`load local cache data fail. ${e}`)
      }
    }

    recording() {
      const StaticCollection = this.constructor as typeof PureCollection & { storage: IStorageType }

      const { key, engine } = {
        ...__S__,
        ...StaticCollection.storage
      }

      if (!engine) return () => {}

      const types = StaticCollection.types.filter((Q: any) => !!Q.enableStorage)
      return autorun(() => {
        const models = types.reduce((oo, type) => oo.concat(this.findAll(type).map(modelToJSON)), [])
        let data = JSON.stringify(models)
        engine.setItem(key, data)
      })
    }
  }

  return (WithStorageForCollection as unknown) as ICollectionConstructor<IStorageMixin<T> & T> & {
    storage: IStorageType
  }
}
