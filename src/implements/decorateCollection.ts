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
import { IRawModel, mapItems } from 'datx-utils'
import { action } from 'mobx'

import { clearAllCache, clearCacheByType } from './cache'
import { GenericModel } from './GenericModel'
import { flattenModel, removeModel } from './helpers/model'
import { isBrowser } from './helpers/utils'
import {
  ISkeletonCollection,
  ISkeletonModel,
  IResponseView,
  IRawData,
  IRequestOptions,
  $ElementOf
} from '../interfaces'
import { query } from './NetworkUtils'

export function decorateCollection(BaseClass: typeof PureCollection) {
  class SkeletonCollection extends BaseClass implements ISkeletonCollection {
    public static types =
      BaseClass.types && BaseClass.types.length ? BaseClass.types.concat(GenericModel) : [GenericModel]
    public static cache: boolean = (BaseClass as any)['cache'] === undefined ? isBrowser : (BaseClass as any)['cache']

    public static defaultModel = BaseClass['defaultModel'] || GenericModel

    sync<T extends ISkeletonModel | ISkeletonModel[], D = T extends any[] ? any[] : any>(data?: IRawData<D>): T
    sync<T extends ISkeletonModel | ISkeletonModel[], D = T extends any[] ? any[] : any>(
      type: IType | IModelConstructor<T>,
      data: D
    ): T

    @action public sync<T extends ISkeletonModel | ISkeletonModel[], D = T extends any[] ? any[] : any>(
      raw: any,
      data?: any
    ): T {
      if (!raw) return null
      let type: IType

      if (arguments.length === 1 && Object.prototype.toString.call(raw) === '[object Object]') {
        type = getModelType(raw.type)
        data = raw.data
      } else {
        type = getModelType(raw)
      }

      if (!data) return null

      return mapItems(data, (item: any) => this.__addRecord<$ElementOf<T>>(item, type)) as any
    }

    fetch<T extends ISkeletonModel = ISkeletonModel>(
      type: IType | T | IModelConstructor<T>,
      ids?: IIdentifier | IIdentifier[],
      options?: IRequestOptions
    ): Promise<IResponseView<T>>

    fetch<T extends ISkeletonModel = ISkeletonModel>(
      type: IType | T | IModelConstructor<T>,
      options?: IRequestOptions
    ): Promise<IResponseView<T>>

    public fetch<T extends ISkeletonModel = ISkeletonModel>(
      type: IType | T | IModelConstructor<T>,
      ids?: any,
      options?: any
    ): Promise<IResponseView<T>> {
      const modelType = getModelType(type)

      if (arguments.length === 2 && Object.prototype.toString.call(ids) === '[object Object]') {
        options = ids as IRequestOptions
        ids = undefined
      }

      return query<T>(modelType, options, this, undefined, ids).then(res => this.__handleErrors<T>(res))
    }

    public removeOne(type: IType | typeof PureModel, id: IIdentifier, remote?: boolean | IRequestOptions): Promise<void>
    public removeOne(model: PureModel, remote?: boolean | IRequestOptions): Promise<void>
    @action public removeOne(
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
        return removeModel((model as any) as ISkeletonModel, typeof remove === 'object' ? remove : undefined)
      }

      if (model) {
        super.removeOne(model)
      }

      clearCacheByType(type)

      return Promise.resolve()
    }

    @action public removeAll(type: string | number | typeof PureModel) {
      super.removeAll(type)
      clearCacheByType(getModelType(type))
    }

    @action public reset() {
      super.reset()
      clearAllCache()
    }

    private __handleErrors<T extends ISkeletonModel>(response: IResponseView<T>) {
      if (response.error) {
        throw response.error
      }

      return response
    }

    private __addRecord<T extends ISkeletonModel = ISkeletonModel>(item: any, type: IType): T {
      const StaticCollection = this.constructor as typeof PureCollection
      const id = item.id
      let record: T | null = id === undefined ? null : this.findOne<T>(type, id)
      // const Type = StaticCollection.types.find(item => getModelType(item) === type) || GenericModel
      const flattened: IRawModel = flattenModel(item, type)

      if (record) {
        updateModel(record, flattened)
      } else if (StaticCollection.types.filter(item => item.type === type).length) {
        record = this.add<T>(flattened, type)
      } else {
        record = this.add(new GenericModel(flattened)) as T
      }

      return record
    }
  }

  return (SkeletonCollection as unknown) as ICollectionConstructor<PureCollection & ISkeletonCollection>
}
