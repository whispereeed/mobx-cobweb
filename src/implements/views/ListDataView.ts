/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 12:24. *
 ***************************************************/
import { IListDataView, IRequestOptions, IResponseView, ISkeletonModel } from '../../interfaces'
import { ResponseView } from '../ResponseView'
import { action, observable } from 'mobx'

export class ListDataView<T extends ISkeletonModel> extends ResponseView<T> implements IListDataView<T> {
  data: T[]

  @observable isLoading: boolean = false

  meta: {
    count: number
  }

  private limit: [number, number]

  constructor(response: IResponseView<T>, overrideData?: T | Array<T>) {
    super(response.rawResponse, response.collection, response.requestOptions, overrideData, response.views)
    this.limit = response.requestOptions?.selector?.limit || [0, 10]
  }

  @action
  async infinite(start: number, count: number): Promise<this> {
    this.limit = [start, count]
    this.isLoading = true
    const response = await this.collection.fetch(this.modelType, {
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
    this.isLoading = false
    this.data.push(...(response.data as T[]))
    this.meta = response.meta as any
    return undefined
  }

  @action
  async search(options: IRequestOptions): Promise<this> {
    this.isLoading = true
    const response = await this.collection.fetch(this.modelType, options)
    this.isLoading = false
    this.data = response.data as T[]
    this.meta = response.meta as any
    return this
  }

  first(): Promise<this> {
    const start = 0
    const count = this.limit[1]
    this.limit = [start, count]

    return this.search({
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }

  prev(): Promise<this> {
    let [start, count] = this.limit
    start -= count
    start = start <= 0 ? 0 : start
    this.limit = [start, count]
    return this.search({
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }

  next(): Promise<this> {
    let [start, count] = this.limit
    start += count
    this.limit = [start, count]
    return this.search({
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }

  last(): Promise<this> {
    const [, count] = this.limit
    const start = this.meta.count - count
    this.limit = [start, count]

    return this.search({
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
  }
}
