/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IModelConstructor, IType, IViewConstructor, PureModel, View } from 'datx'

import {
  ISkeletonView,
  ISkeletonCollection,
  ISkeletonModel,
  IResponseView,
  IRawData,
  IRequestOptions
} from '../interfaces'

export function decorateView<U>(BaseClass: typeof View) {
  class SkeletonView<M extends ISkeletonModel = ISkeletonModel> extends BaseClass<M> implements ISkeletonView<M> {
    protected __collection: ISkeletonCollection

    constructor(
      modelType: IModelConstructor<M> | IType,
      collection: ISkeletonCollection,
      sortMethod?: string | ((item: M) => any),
      models: Array<IIdentifier | M> = [],
      unique: boolean = false
    ) {
      super(modelType, collection, sortMethod as string | ((item: PureModel) => any), models, unique)
      this.__collection = collection
    }

    public sync(body?: IRawData): M | Array<M> | null {
      const data = this.__collection.sync(body)

      if (data) {
        this.add(data)
      }

      return data as M | Array<M> | null
    }

    public fetch(id: IIdentifier | IIdentifier[], options?: IRequestOptions): Promise<IResponseView<M>>
    public fetch(options?: IRequestOptions): Promise<IResponseView<M>>
    public fetch(ids: any, options?: any): Promise<IResponseView<M>> {
      if (arguments.length === 1 && Object.prototype.toString.call(ids) === '[object Object]') {
        options = ids as IRequestOptions
        ids = undefined
      }

      return this.__collection
        .fetch<M>(this.modelType, ids, options)
        .then((response) => this.__addFromResponse(response))
    }

    private __addFromResponse(response: IResponseView<M>) {
      if (response.data) {
        this.add(response.data)
      }
      response.views.push(this)
      return response
    }
  }

  return (SkeletonView as unknown) as IViewConstructor<ISkeletonModel, ISkeletonView>
}
