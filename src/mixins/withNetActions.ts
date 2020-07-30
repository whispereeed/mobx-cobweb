/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:36. *
 ***************************************************/
import { action } from 'mobx'
import { IModelConstructor, PureCollection, PureModel, getModelCollection, getModelId, getModelType } from '../datx'
import { IRawModel } from 'datx-utils'
import { INetActionsMixin } from '../interfaces/INetActionsMixin'
import { IRequestOptions, IResponseData } from '../interfaces'
import { fetchModelRef, fetchModelRefs, removeModel, upsertModel, requestOnModel } from '../helpers/model'
import { error } from '../helpers/utils'
import { INetPatchesMixin } from '../interfaces/INetPatchesMixin'
import { ResponseView } from '../ResponseView'

export function withNetActions<T extends PureModel>(Base: IModelConstructor<T>) {
  const BaseClass = Base as typeof PureModel

  class WithNetActions extends BaseClass implements INetActionsMixin<T> {
    static endpoint: string | (() => string)

    constructor(rawData: IRawModel, collection?: PureCollection) {
      super(rawData, collection)
    }

    @action public refresh(): Promise<ResponseView<T>> {
      const collection: INetPatchesMixin<PureCollection> = getModelCollection(this) as any
      if (!collection) {
        throw error(`before calling model.refresh API, add the model to the collection first.`)
      }
      return collection.fetch<T>(getModelType(this), getModelId(this))
    }
    @action public upsert(options?: IRequestOptions): Promise<this> {
      return upsertModel(this, options)
    }
    @action public remove(options?: IRequestOptions): Promise<void> {
      return removeModel(this, options)
    }
    @action public request<D>(options: IRequestOptions): Promise<IResponseData<D>> {
      return requestOnModel<this, D>(this, options)
    }
    @action public fetchRef(field: string, options?: IRequestOptions) {
      return fetchModelRef(this, field, options)
    }
    @action public fetchRefs(options?: IRequestOptions) {
      return fetchModelRefs(this, options)
    }
  }

  return (WithNetActions as unknown) as IModelConstructor<INetActionsMixin<T> & T> & {
    endpoint: string | (() => string)
  }
}
