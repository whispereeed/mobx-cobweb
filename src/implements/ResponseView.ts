/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { getModelId, getModelType, IType, modelToJSON, PureModel, updateModel, updateModelId, View } from 'datx'
import { action } from 'mobx'

import { GenericModel } from './GenericModel'
import { flattenModel } from './helpers/model'

import {
  IResponseView,
  IError,
  IResponseHeaders,
  IRequestOptions,
  IRawResponse,
  IHeaders,
  ISkeletonModel,
  ISkeletonCollection
} from '../interfaces'

export class ResponseView<T extends ISkeletonModel> implements IResponseView<T> {
  public data: T | Array<T> | null = null

  public meta: object

  public headers?: IResponseHeaders

  public requestHeaders?: IHeaders

  public error?: Array<IError> | Error

  public status?: number

  public views: Array<View> = []

  public readonly collection?: ISkeletonCollection

  public readonly requestOptions?: IRequestOptions

  public readonly rawResponse: IRawResponse

  public readonly modelType: IType

  constructor(
    rawResponse: IRawResponse,
    collection?: ISkeletonCollection,
    requestOptions?: IRequestOptions,
    overrideData?: T | Array<T>,
    views?: Array<View>
  ) {
    this.collection = collection
    this.requestOptions = requestOptions
    this.rawResponse = rawResponse
    this.modelType = getModelType(rawResponse.data.type)
    this.status = rawResponse.status

    if (views) {
      this.views = views
    }

    if (collection) {
      this.data = overrideData ? collection.add<T>(overrideData as T) : collection.sync<T>(rawResponse.data)
    } else if (rawResponse.data) {
      // The case when a record is not in a store and save/remove are used
      const resp = rawResponse.data

      if (resp.data) {
        if (resp.data instanceof Array) {
          throw new Error('A save/remove operation should not return an array of results')
        }

        this.data = overrideData || (new GenericModel(flattenModel(undefined, resp.data)) as T)
      }
    }

    this.views.forEach(view => {
      if (this.data) {
        view.add(this.data)
      }
    })

    this.meta = (rawResponse.data && rawResponse.data.meta) || {}
    this.headers = rawResponse.headers
    this.requestHeaders = rawResponse.requestHeaders
    this.error = rawResponse.error
  }

  @action public replaceData(data: T): ResponseView<T> {
    const record: PureModel = this.data as PureModel
    if (record === data) {
      return this
    }

    const newId = getModelId(record)
    const type = getModelType(record)

    const viewIndexes = this.views.map(view => view.list.indexOf(record))

    if (this.collection) {
      this.collection.removeOne(type, newId)
      this.collection.add(data)
    }

    updateModel(data, modelToJSON(record))
    updateModelId(data, newId)

    this.views.forEach((view, index) => {
      if (viewIndexes[index] !== -1) {
        view.list[viewIndexes[index]] = data
      }
    })

    return new ResponseView(this.rawResponse, this.collection, this.requestOptions, data)
  }
}
