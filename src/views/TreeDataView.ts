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

  private readonly childrenCacheStore = new Map<T, ListDataView<T>>()
  private readonly childrenCacheDisposer = new Map<T, IReactionDisposer>()

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

  @action public async search(options: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, options)
    this.isLoading = false
    return response
  }
  @action public async searchRoots(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, { action: '/roots', ...options })
    this.add(response.data)
    this.isLoading = false
    return response
  }
  @action public async infinite(model: T, options?: IRequestOptions): Promise<ListDataView<T>> {
    if (!this.childrenCacheStore.has(model)) {
      const cache = new ListDataView<T>(this.modelType, this.collection)
      this.childrenCacheStore.set(model, cache)
      this.childrenCacheDisposer.set(
        model,
        reaction(
          () => cache.list,
          // @ts-ignore
          (list) => (model[this.childrenProperty] = list)
        )
      )
    }
    const cache = this.childrenCacheStore.get(model)
    await cache.infinite({ action: `/$${getModelId(model)}/children`, ...options })
    return cache
  }
  @action public async searchParents(model: T | IIdentifier, options?: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, {
      action: `/$${getModelId(model)}/parents`,
      ...options
    })
    this.isLoading = false
    return response
  }

  disposeInfinite(model: T) {
    if (this.childrenCacheDisposer.has(model)) {
      this.childrenCacheDisposer.get(model).apply(null)
    }
  }
}
