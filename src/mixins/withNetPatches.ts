/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { action } from 'mobx'
import { getMeta, mapItems } from 'datx-utils'
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
} from '../datx'

import { INetPatchesCollectionMixin } from '../interfaces/INetPatchesCollectionMixin'
import { clearCache, clearCacheByType } from '../helpers/cache'
import { ResponseView } from '../ResponseView'
import { removeModel } from '../helpers/model'
import { INetworkAdapter, IRequestOptions } from '../interfaces'
import { Model } from '../Model'
import { query } from '../helpers/network'
import { isBrowser } from '../helpers/utils'
import { ORPHAN_MODEL_ID_KEY, ORPHAN_MODEL_ID_VAL, setModelPersisted } from '../helpers/consts'

export function withNetPatches<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithNetPatches extends BaseClass implements INetPatchesCollectionMixin<T> {
    static types = BaseClass.types && BaseClass.types.length ? BaseClass.types.concat(Model) : [Model]
    static cache: boolean = (BaseClass as any)[''] === undefined ? isBrowser : (BaseClass as any).cache
    static defaultModel = BaseClass.defaultModel || Model

    adapter: INetworkAdapter
    setNetworkAdapter(adapter: INetworkAdapter) {
      this.adapter = adapter
    }

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
    @action fetch<T extends PureModel>(
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
        // The model is not in the collection, we shouldn't remove it
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
      clearCache()
    }

    private __addRecord<T extends PureModel>(item: Record<string, any>, type: IType): T {
      const StaticCollection = this.constructor as typeof PureCollection
      const ModelClass = StaticCollection.types.find((Q) => Q.type === type)
      let record: T

      if (ModelClass) {
        const idField = getMeta<string>(ModelClass, 'idField', 'id', true)
        let id: IIdentifier

        if (idField === ORPHAN_MODEL_ID_KEY) {
          record = this.findOne<T>(type, ORPHAN_MODEL_ID_VAL)
        } else {
          id = item[idField]
          record = id === undefined ? null : this.findOne<T>(type, id)
        }

        if (record) {
          record = updateModel(record, item)
        } else {
          record = this.add<T>(item, type)
        }
        setModelPersisted(record, Boolean(id))
      } else {
        record = this.add(new Model(item, this)) as any
      }

      return record
    }
  }

  return (WithNetPatches as unknown) as ICollectionConstructor<INetPatchesCollectionMixin<T> & T> & {
    cache: boolean
  }
}
