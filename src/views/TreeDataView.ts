/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 15:10. *
 ***************************************************/
import { getModelId, getModelType, IModelConstructor, IType, PureModel, View, IIdentifier } from '../datx'
import { action, computed, observable, reaction, IReactionDisposer } from 'mobx'
import { Collection } from '../Collection'
import { ListDataView } from './ListDataView'
import { ResponseView } from '../ResponseView'
import { IRequestOptions } from '../interfaces'

export class TreeDataView<T extends PureModel> extends View<T> {
  readonly collection: Collection
  readonly modelType: IType
  public childrenProperty: string = 'children'

  private readonly cacheStore = new Map<IIdentifier, ListDataView<T>>()
  private readonly cacheDisposer = new Map<IIdentifier, IReactionDisposer>()

  @observable public isLoading: boolean = false

  @computed get data(): T[] {
    return this.list
  }
  @computed get roots(): T[] {
    return this.list
  }

  constructor(modelType: IType | IModelConstructor<T>, collection: Collection, models?: Array<IIdentifier | T>) {
    super(modelType, collection, undefined, models, true)
    this.modelType = getModelType(modelType)
    this.collection = collection
  }

  @action public async infinite(model: T | IIdentifier, options?: IRequestOptions): Promise<ResponseView<T[]>> {
    const id = getModelId(model)
    const cache = this.getInfiniteListDataView(model)
    return cache.infinite({ action: `/$${id}/children`, ...options })
  }
  @action public async searchRoots(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, { action: '/roots', ...options })
    this.add(response.data)
    this.isLoading = false
    return response
  }
  @action public async searchParents(model: T | IIdentifier, options?: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const id = getModelId(model)
    const response = await this.collection.fetch<T>(this.modelType, {
      action: `/$${id}/parents`,
      ...options
    })
    this.isLoading = false
    return response
  }

  disposeInfiniteListDataView(model: T | IIdentifier) {
    const id = getModelId(model)
    if (this.cacheDisposer.has(id)) {
      this.cacheDisposer.get(id).call(null)
      this.cacheStore.delete(id)
    }
  }

  getInfiniteListDataView(model: T | IIdentifier) {
    const id = getModelId(model)
    if (!this.cacheStore.has(id)) {
      const cache = new ListDataView<T>(this.modelType, this.collection)
      this.cacheStore.set(id, cache)
      this.cacheDisposer.set(
        id,
        reaction(
          () => cache.list,
          // @ts-ignore
          (list) => (model[this.childrenProperty] = list)
        )
      )
      return cache
    }
    return this.cacheStore.get(getModelId(model))
  }
}
