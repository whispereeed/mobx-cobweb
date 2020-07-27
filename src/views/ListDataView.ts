/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 15:10. *
 ***************************************************/
import { getModelType, IModelConstructor, IType, PureModel } from 'datx'
import { Collection } from '../Collection'
import { action, observable } from 'mobx'
import { IRequestOptions } from '../interfaces'

export class ListDataView<T extends PureModel> {
  protected collection: Collection
  protected modelType: IType

  private meta: { count: number }
  private limit: [number, number] = [0, 10]
  private requestOptions?: IRequestOptions

  public data: T[]
  @observable public isLoading: boolean = false

  constructor(modelType: IType | IModelConstructor<T>, collection: Collection) {
    this.modelType = getModelType(modelType)
    this.collection = collection
  }

  @action public async infinite(start: number, count: number): Promise<this> {
    this.limit = [start, count]
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, {
      ...this.requestOptions,
      selector: {
        ...this.requestOptions.selector,
        limit: [start, count]
      }
    })
    this.requestOptions = response.requestOptions
    this.isLoading = false
    this.data.push(...response.data)
    this.meta = response.meta as any
    return undefined
  }
  @action public async search(options: IRequestOptions): Promise<this> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, options)
    this.requestOptions = response.requestOptions
    this.isLoading = false
    this.data = response.data
    this.meta = response.meta as any
    return this
  }

  public first(): Promise<this> {
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
  public prev(): Promise<this> {
    // tslint:disable-next-line:prefer-const
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
  public next(): Promise<this> {
    // tslint:disable-next-line:prefer-const
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
  public last(): Promise<this> {
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
