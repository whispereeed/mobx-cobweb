/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 12:24. *
 ***************************************************/
import { IRequestOptions } from '../interfaces'
import { ResponseView } from '../ResponseView'
import { action, observable } from 'mobx'
import { PureModel } from 'datx'
import { Collection } from '..'

export class ListDataView<T extends PureModel> extends ResponseView<T[]> {
  collection: Collection

  data: T[]

  @observable isLoading: boolean = false

  meta: {
    count: number
  }

  private limit: [number, number]

  constructor(response: ResponseView<T[]>, overrideData?: T[]) {
    super(response.rawResponse, response.collection, response.requestOptions, overrideData, response.views)
    this.limit = response.requestOptions?.selector?.limit || [0, 10]
  }

  @action
  async infinite(start: number, count: number): Promise<this> {
    this.limit = [start, count]
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, {
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
    this.isLoading = false
    this.data.push(...response.data)
    this.meta = response.meta as any
    return undefined
  }

  @action
  async search(options: IRequestOptions): Promise<this> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, options)
    this.isLoading = false
    this.data = response.data
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
