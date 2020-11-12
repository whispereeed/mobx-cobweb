/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 15:10. *
 ***************************************************/
import { getModelId, getModelType, IModelConstructor, IType, PureModel, IIdentifier } from '../datx'
import { action, reaction, IReactionDisposer } from 'mobx'
import { Collection } from '../Collection'
import { ListDataView } from './ListDataView'
import { ResponseView } from '../ResponseView'
import { IRequestOptions } from '../interfaces'
import { isIdentifier } from '../helpers/utils'

export class TreeDataView<T extends PureModel> extends ListDataView<T> {
  readonly collection: Collection
  readonly modelType: IType
  public childrenProperty: string = 'children'

  private readonly cacheStore = new Map<IIdentifier, ListDataView<T>>()
  private readonly cacheDisposer = new Map<IIdentifier, IReactionDisposer>()

  constructor(modelType: IType | IModelConstructor<T>, collection: Collection, models?: Array<IIdentifier | T>) {
    super(modelType, collection, models)
    this.modelType = getModelType(modelType)
    this.collection = collection
  }

  @action public async infiniteNodes(model: T | IIdentifier, options?: IRequestOptions): Promise<ResponseView<T[]>> {
    const id = getModelId(model)
    const cache = this.getInfiniteListDataView(model)
    return cache.infinite({ action: `/$${id}/children`, ...options })
  }

  @action public async infiniteRoots(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    return this.infinite({ action: '/roots', ...options })
  }

  clear(model?: T | IIdentifier) {
    if (model || isIdentifier(model)) {
      const id = getModelId(model)
      if (this.cacheDisposer.has(id)) {
        this.cacheDisposer.get(id).call(null)
        this.cacheStore.delete(id)
      }
      return
    }
    this.cacheDisposer.forEach((fn) => fn())
    this.cacheDisposer.clear()
    this.cacheStore.clear()
  }

  getInfiniteListDataView(model: T | IIdentifier) {
    const id = getModelId(model)
    if (!this.cacheStore.has(id)) {
      const cache = new ListDataView<T>(this.modelType, this.collection)
      this.cacheStore.set(id, cache)
      const __model: T = model instanceof PureModel ? (model as T) : this.__collection.findOne<T>(this.modelType, id)
      this.cacheDisposer.set(
        id,
        reaction(
          () => cache.list, // @ts-ignore
          (list) => (__model[this.childrenProperty] = list)
        )
      )
      return cache
    }

    return this.cacheStore.get(id)
  }
}
