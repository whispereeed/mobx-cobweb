/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/

import { action } from 'mobx'
import { IRawModel, mapItems } from 'datx-utils'
import {
  getModelId,
  getModelType,
  ICollectionConstructor,
  IIdentifier,
  IModelConstructor,
  IType,
  PureCollection,
  PureModel,
  updateModel
} from 'datx'

import { INetPatchesCollection } from '../interfaces/INetPatchesCollection'
import { clearAllCache, clearCacheByType } from '../helpers/cache'
import { ResponseView } from '../ResponseView'
import { flattenModel, removeModel } from '../helpers/model'
import { IRequestOptions } from '../interfaces'
import { GenericModel } from '../GenericModel'
import { query } from '../helpers/NetworkUtils'
import { isBrowser } from '../helpers/utils'

export function withNetPatches<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithNetPatches extends BaseClass implements INetPatchesCollection<T> {
    static types = BaseClass.types && BaseClass.types.length ? BaseClass.types.concat(GenericModel) : [GenericModel]
    static cache: boolean = (BaseClass as any)[''] === undefined ? isBrowser : (BaseClass as any)['cache']
    static defaultModel = BaseClass.defaultModel || GenericModel

    @action sync<P extends PureModel>(raw: any, data?: any): P | P[] {
      if (!raw) return null
      let type: IType

      if (arguments.length === 1 && Object.prototype.toString.call(raw) === '[object Object]') {
        type = getModelType(raw.type)
        data = raw.data
      } else {
        type = getModelType(raw)
      }

      if (!data) return null

      return mapItems(data, (item: any) => this.__addRecord<P>(item, type)) as any
    }

    fetch<T extends PureModel>(
      type: IType | T | IModelConstructor<T>,
      ids?: any,
      options?: any
    ): Promise<ResponseView<T | T[]>> {
      const modelType = getModelType(type)

      if (arguments.length === 2 && Object.prototype.toString.call(ids) === '[object Object]') {
        options = ids as IRequestOptions
        ids = undefined
      }

      return query<T>(modelType, options, this, undefined, ids).then((res) => {
        if (res.error) {
          throw res.error
        }
        return res
      })
    }

    @action removeOne(
      obj: IType | typeof PureModel | PureModel,
      id?: IIdentifier | boolean | IRequestOptions,
      remote?: boolean | IRequestOptions
    ): Promise<void> {
      const remove = typeof id === 'boolean' || typeof id === 'object' ? id : remote
      let modelId: number | string | undefined

      if (typeof id === 'string' || typeof id === 'number') {
        modelId = id
      } else if (typeof id === 'boolean' || obj instanceof PureModel) {
        modelId = getModelId(obj)
      }

      const type = getModelType(obj)
      const model = modelId !== undefined && this.findOne(type, modelId)

      if (model && modelId !== undefined && getModelId(model) !== modelId) {
        // The model is not in the collection and we shouldn't remove a random one
        return Promise.resolve()
      }

      if (model && remove) {
        return removeModel(model, typeof remove === 'object' ? remove : undefined)
      }

      if (model) {
        super.removeOne(model)
      }

      clearCacheByType(type)

      return Promise.resolve()
    }

    @action removeAll(type: string | number | typeof PureModel) {
      super.removeAll(type)
      clearCacheByType(getModelType(type))
    }

    @action reset() {
      super.reset()
      clearAllCache()
    }

    private __addRecord<T extends PureModel>(item: any, type: IType): T {
      const StaticCollection = this.constructor as typeof PureCollection
      const id = item.id
      let record: T = id === undefined ? null : this.findOne<T>(type, id)
      // const Type = StaticCollection.types.find(item => getModelType(item) === type) || GenericModel
      const flattened: IRawModel = flattenModel(item, type)

      if (record) {
        updateModel(record, flattened)
      } else if (StaticCollection.types.filter((item) => item.type === type).length) {
        record = this.add<T>(flattened, type)
      } else {
        record = this.add(new GenericModel(flattened)) as any
      }

      return record
    }
  }

  return (WithNetPatches as unknown) as ICollectionConstructor<INetPatchesCollection<T> & T>
}
