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
  updateModel,
  commitModel
} from '../datx'

import { INetActionsMixinForCollection } from '../interfaces/INetActionsMixin'
import { clearCache, clearCacheByType } from '../helpers/cache'
import { ResponseView } from '../ResponseView'
import { getModelIdField, isOrphanModel, removeModel } from '../helpers/model'
import { INetworkAdapter, IRequestOptions, IRawResponse, IOneOrMany } from '../interfaces'
import { Model } from '../Model'
import { query, request } from '../helpers/network'
import { ORPHAN_MODEL_ID_KEY, ORPHAN_MODEL_ID_VAL, setModelPersisted } from '../helpers/consts'
import { IDataRef, createDataRef } from '../helpers/dataref'
import { isPlainObject } from '../helpers/utils'

export function withNetActionsForCollection<T extends PureCollection>(Base: ICollectionConstructor<T>) {
  const BaseClass = Base as typeof PureCollection

  class WithNetActionsForCollection extends BaseClass implements INetActionsMixinForCollection<T> {
    static types = BaseClass.types && BaseClass.types.length ? BaseClass.types.concat(Model) : [Model]
    static defaultModel = Model

    adapter: INetworkAdapter

    setNetworkAdapter(adapter: INetworkAdapter) {
      this.adapter = adapter
    }

    @action sync<P extends PureModel>(raw: IOneOrMany<IRawModel>, type: any): P | P[] {
      if (!raw) return null

      const modelType = getModelType(type)
      const StaticCollection = this.constructor as typeof PureCollection
      const ModelClass = StaticCollection.types.find((Q) => Q.type === modelType)

      return mapItems(raw, (item: IRawModel) => {
        let record: P

        if (ModelClass) {
          const idField = getModelIdField(ModelClass)

          let id: IIdentifier

          if (idField === ORPHAN_MODEL_ID_KEY) {
            record = this.findOne<P>(modelType, ORPHAN_MODEL_ID_VAL)
          } else {
            id = item[idField]
            record = id === undefined ? null : this.findOne<P>(modelType, id)
          }

          if (record) {
            record = updateModel(record, item)
          } else {
            record = this.add<P>(item, modelType)
          }

          setModelPersisted(record, Boolean(id))
        } else {
          record = (this.add(new Model(item, this)) as any) as P
        }

        commitModel(record)
        return record
      })
    }

    @action fetch<T extends PureModel>(
      type: IType | T | IModelConstructor<T>,
      ids?: any,
      options?: any
    ): Promise<ResponseView<T | T[]>> {
      const modelType = getModelType(type)

      if (arguments.length === 2 && isPlainObject(ids)) {
        options = ids as IRequestOptions
        ids = undefined
      }

      return query<T>(modelType, options, this, ids)
    }

    @action removeOne(
      obj: IType | typeof PureModel | PureModel,
      id?: IIdentifier | boolean | IRequestOptions,
      remote?: boolean | IRequestOptions
    ): Promise<boolean> {
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
        return Promise.resolve(false)
      }

      if (model && remove) {
        return removeModel(model, typeof remove === 'object' ? remove : undefined)
      }

      if (model) {
        super.removeOne(model)
      }

      clearCacheByType(type)
      return Promise.resolve(true)
    }

    @action removeAll(type: string | number | typeof PureModel) {
      super.removeAll(type)
      clearCacheByType(getModelType(type))
    }

    @action reset() {
      super.reset()
      clearCache()
    }

    @action request(url: string, options: IRequestOptions): Promise<IRawResponse> {
      return request(this as any, url, options)
    }

    @action ffetch<T extends PureModel>(
      type: IType | T | IModelConstructor<T>,
      ids?: any,
      options?: any
    ): IDataRef<T | T[], ResponseView<any>> {
      const modelType = getModelType(type)
      let initData: T | T[] | null

      if (arguments.length === 1 || (arguments.length === 2 && isPlainObject(ids))) {
        if (isOrphanModel(type)) {
          initData = this.findOne<T>(modelType, ORPHAN_MODEL_ID_VAL)
        } else {
          initData = this.findAll(modelType)
        }
      } else {
        initData = mapItems<IIdentifier, T>(ids, (id) => this.findOne<T>(modelType, id))
      }

      return createDataRef<T | T[]>((update, error) => {
        this.fetch(type, ids, options).then((response) => {
          response.error ? error(response) : update(response.data)
        })
      }, initData)
    }
  }

  return (WithNetActionsForCollection as unknown) as ICollectionConstructor<INetActionsMixinForCollection<T> & T> & {
    cache: boolean
  }
}
