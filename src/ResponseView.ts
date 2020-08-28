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
  isModel,
  View
} from './datx'
import { action, isArrayLike } from 'mobx'
import { IRequestOptions, IRawResponse, IOneOrMany, RESPONSE_DATATYPE } from './interfaces'
import { INetActionsMixinForCollection } from './interfaces/INetActionsMixin'

export class ResponseView<T extends IOneOrMany<PureModel>> implements IRawResponse {
  public readonly data: T | null = null
  public readonly meta: Record<string, any>
  public readonly headers?: Headers
  public readonly responseHeaders?: Headers
  public readonly requestHeaders?: Record<string, string>
  public readonly dataType: RESPONSE_DATATYPE
  public readonly error?: Error
  public readonly status?: number
  public readonly views: View[] = []

  public readonly collection?: PureCollection
  public readonly requestOptions?: IRequestOptions
  public readonly modelType: IType

  private readonly rawResponse: IRawResponse

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

    this.dataType = rawResponse.dataType
    this.status = rawResponse.status
    this.headers = rawResponse.headers
    this.responseHeaders = rawResponse.responseHeaders
    this.requestHeaders = rawResponse.requestHeaders
    this.error = rawResponse.error
    this.meta = rawResponse.meta

    if (views) {
      this.views = views
    }

    if (overrideData) {
      this.data = collection.add<T>(overrideData)
    } else {
      this.data = ((collection as unknown) as INetActionsMixinForCollection<PureCollection>).sync(
        rawResponse.data,
        this.modelType
      )
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
