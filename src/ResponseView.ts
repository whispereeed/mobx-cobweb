/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import {
  getModelId,
  getModelType,
  IType,
  modelToJSON,
  PureCollection,
  PureModel,
  updateModel,
  updateModelId,
  View
} from './datx'
import { action, isArrayLike } from 'mobx'
import {
  IRequestOptions,
  IRawResponse,
  RESPONSE_DATATYPE,
  ISingleResponseData,
  IListResponseData,
  IPageResponseData,
  IOneOrMany
} from './interfaces'
import { INetActionsMixinForCollection } from './interfaces/INetActionsMixin'
import { isModel } from '@issues-beta/datx'

export class ResponseView<T extends IOneOrMany<PureModel>> {
  public readonly data: T | null = null
  public readonly meta: Record<string, any>
  public readonly headers?: Headers
  public readonly responseHeaders?: Headers
  public readonly requestHeaders?: Record<string, string>
  public readonly error?: Error
  public readonly status?: number
  public readonly views: View[] = []

  public readonly collection?: PureCollection
  public readonly requestOptions?: IRequestOptions
  public readonly rawResponse: IRawResponse
  public readonly modelType: IType

  constructor(
    rawResponse: IRawResponse,
    collection: PureCollection,
    requestOptions?: IRequestOptions,
    overrideData?: T,
    views?: View[]
  ) {
    this.collection = collection
    this.requestOptions = requestOptions
    this.rawResponse = rawResponse
    this.modelType = getModelType(rawResponse.modelType)
    this.status = rawResponse.status
    this.headers = rawResponse.headers
    this.responseHeaders = rawResponse.responseHeaders
    this.requestHeaders = rawResponse.requestHeaders
    this.error = rawResponse.error

    if (views) {
      this.views = views
    }

    if (overrideData) {
      this.data = collection.add<T>(overrideData)
    } else {
      switch (rawResponse.dataType) {
        case RESPONSE_DATATYPE.SINGLE_DATA:
          this.data = ((collection as unknown) as INetActionsMixinForCollection<PureCollection>).sync(
            (rawResponse.data as ISingleResponseData).value,
            this.modelType
          ) as T
          break
        case RESPONSE_DATATYPE.LIST:
        case RESPONSE_DATATYPE.PAGE:
          this.data = ((collection as unknown) as INetActionsMixinForCollection<PureCollection>).sync(
            (rawResponse.data as IListResponseData).items,
            this.modelType
          ) as T
          this.meta = { count: (rawResponse.data as IPageResponseData)?.count }
          break
        case RESPONSE_DATATYPE.SINGLE_STATUS:
        case RESPONSE_DATATYPE.SINGLE:
        case RESPONSE_DATATYPE.CREATION:
        case RESPONSE_DATATYPE.COUNT:
          this.meta = rawResponse.data
          break
        case RESPONSE_DATATYPE.ERROR:
          this.data = null
          this.error = (rawResponse.data as any) as Error
          break
      }
    }

    if (isModel(this.data) || (isArrayLike(this.data) && this.data.every(isModel))) {
      this.views?.forEach((view) => view.add(this.data))
    }
  }

  @action public replace(data: T): ResponseView<T> {
    const record = this.data

    if (record === data) {
      return this
    }

    const newId = getModelId(record)
    const type = getModelType(record)

    if (this.collection) {
      this.collection.removeOne(type, newId)
      this.collection.add(data)
    }

    updateModel(data, modelToJSON(record!))
    updateModelId(data, newId)

    const viewIndexes = this.views?.map((view) => view.list.indexOf(record))
    this.views?.forEach((view, index) => {
      if (viewIndexes[index] !== -1) {
        view.list[viewIndexes[index]] = data
      }
    })

    return new ResponseView(this.rawResponse, this.collection, this.requestOptions, data)
  }
}
