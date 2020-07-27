/***************************************************
 * Created by nanyuantingfeng on 2020/7/27 16:40. *
 ***************************************************/
import { ICollectionConstructor, modelToJSON, PureCollection, PureModel } from 'datx'
import { autorun } from 'mobx'
import LZ from 'lz-string'
import { IStorageCollectionMixin } from '../interfaces/IStorageCollectionMixin'

export function withStorage<T extends PureCollection>(Base: ICollectionConstructor<T>) {
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
        const models = types.map((type) => this.findAll(type)).map(modelToJSON)
        const data = LZ.compress(JSON.stringify(models))
        localStorage.setItem(storageKey, data)
      })
    }
  }

  return (WithLocalStorage as unknown) as ICollectionConstructor<IStorageCollectionMixin<T> & T>
}
