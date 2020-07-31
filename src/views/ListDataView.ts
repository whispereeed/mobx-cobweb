/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 15:10. *
 ***************************************************/
import { getModelType, IModelConstructor, IType, PureModel, View, IIdentifier } from '../datx'
import { action, computed, observable, transaction } from 'mobx'
import { Collection } from '../Collection'
import { IRequestOptions } from '../interfaces'
import { ResponseView } from '../ResponseView'

export class ListDataView<T extends PureModel> extends View<T> {
  readonly collection: Collection
  readonly modelType: IType

  private meta: { count: number }
  private limit: [number, number] = [0, 10]
  private requestOptions?: IRequestOptions = {}

  @observable public isLoading: boolean = false
  @computed get data() {
    return this.list
  }

  constructor(modelType: IModelConstructor<T> | IType, collection: Collection, models?: Array<IIdentifier | T>) {
    super(modelType, collection, undefined, models, true)
    this.modelType = getModelType(modelType)
    this.collection = collection
  }

  @action public async infinite(start: number, count: number, options?: IRequestOptions): Promise<ResponseView<T[]>> {
    this.limit = [start, count]
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, {
      ...this.requestOptions,
      ...options,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
    this.requestOptions = response.requestOptions
    this.isLoading = false
    this.add(response.data)
    this.meta = response.meta as any
    return response
  }
  @action public async search(options: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, options)
    this.requestOptions = response.requestOptions
    this.isLoading = false
    transaction(() => {
      this.removeAll()
      this.add(response.data)
    })
    this.meta = response.meta as any
    return response
  }

  public first(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    const start = 0
    const count = this.limit[1]
    this.limit = [start, count]
    return this.search({
      ...this.requestOptions,
      ...options,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }
  public prev(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    let [start, count] = this.limit
    start -= count
    start = start <= 0 ? 0 : start
    this.limit = [start, count]
    return this.search({
      ...this.requestOptions,
      ...options,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }
  public next(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    let [start, count] = this.limit
    start += count
    this.limit = [start, count]
    return this.search({
      ...this.requestOptions,
      ...options,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }
  public last(options?: IRequestOptions): Promise<ResponseView<T[]>> {
    const [, count] = this.limit
    const start = this.meta.count - count
    this.limit = [start, count]

    return this.search({
      ...this.requestOptions,
      ...options,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }
}
