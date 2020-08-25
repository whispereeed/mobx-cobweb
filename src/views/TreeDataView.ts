/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 15:10. *
 ***************************************************/
import { getModelId, getModelType, IModelConstructor, IType, PureModel, View, IIdentifier } from '../datx'
import { action, computed, observable } from 'mobx'
import { Collection } from '../Collection'
import { ListDataView } from './ListDataView'
import { ResponseView } from '../ResponseView'
import { IRequestOptions } from '../interfaces'

export class TreeDataView<T extends PureModel> extends View<T> {
  readonly collection: Collection
  readonly modelType: IType

  @observable public isLoading: boolean = false
  @computed get data(): T[] {
    return this.list
  }

  constructor(modelType: IType | IModelConstructor<T>, collection: Collection, models?: Array<IIdentifier | T>) {
    super(modelType, collection, undefined, models, true)
    this.modelType = getModelType(modelType)
    this.collection = collection
  }

  @action public async search(options: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, options)
    this.isLoading = false
    this.add(response.data)
    return response
  }
  @action public async searchRoots(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, {
      action: '/roots',
      ...options
    })
    this.isLoading = false
    return response
  }
  @action public async searchChildren(model: T | IIdentifier, options?: IRequestOptions): Promise<ListDataView<T>> {
    const id = getModelId(model)
    this.isLoading = true
    const listDataView = new ListDataView<T>(this.modelType, this.collection)
    await listDataView.infinite(0, 20, { action: `/${id}/children`, ...options })
    this.isLoading = false
    return listDataView
  }
  @action public async searchParents(model: T | IIdentifier, options?: IRequestOptions): Promise<ResponseView<T[]>> {
    const id = getModelId(model)
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, { action: `/${id}/parents`, ...options })
    this.isLoading = false
    return response
  }
}
