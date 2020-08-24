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
import { action } from 'mobx'
import { IError, IRequestOptions, IRawResponse, $PickOf, IOneOrMany } from './interfaces'
import { INetActionsMixinForCollection } from './interfaces/INetActionsMixin'
import { IRawModel } from 'datx-utils'
import { commitModel } from '@issues-beta/datx'
import { isPlainObject } from './helpers/utils'

export class ResponseView<T extends IOneOrMany<PureModel>> {
  public data: T | null = null
  public meta: object
  public headers?: Headers
  public requestHeaders?: Record<string, string>
  public error?: IError[] | Error
  public status?: number
  public views: View[] = []

  public readonly collection?: PureCollection
  public readonly requestOptions?: IRequestOptions
  public readonly rawResponse: IRawResponse<$PickOf<T, IRawModel[], IRawModel>>
  public readonly modelType: IType

  constructor(
    rawResponse: IRawResponse<$PickOf<T, IRawModel[], IRawModel>>,
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

    if (views) {
      this.views = views
    }

    if (overrideData) {
      this.data = collection.add<T>(overrideData)
    } else if (isPlainObject(rawResponse.data)) {
      this.data = ((collection as unknown) as INetActionsMixinForCollection<PureCollection>).sync<T>(
        rawResponse.data,
        this.modelType
      )
    } else if (typeof rawResponse.data === 'boolean') {
      this.data = rawResponse.data
    }

    if (this.data) {
      this.views.forEach((view) => view.add(this.data))
    }

    this.meta = rawResponse.meta || {}
    this.headers = rawResponse.headers
    this.requestHeaders = rawResponse.requestHeaders
    this.error = rawResponse.error
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
    commitModel(data)

    const viewIndexes = this.views.map((view) => view.list.indexOf(record))
    this.views.forEach((view, index) => {
      if (viewIndexes[index] !== -1) {
        view.list[viewIndexes[index]] = data
      }
    })

    return new ResponseView(this.rawResponse, this.collection, this.requestOptions, data)
  }
}
