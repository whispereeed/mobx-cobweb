/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { getModelId, getModelType, IType, modelToJSON, PureCollection, PureModel, updateModel, updateModelId, View } from 'datx'
import { IDictionary } from 'datx-utils'
import { action } from 'mobx'

import { GenericModel } from './GenericModel'

import { IError, IRequestOptions, IRawResponse, $PickOf, ISingleOrMulti } from './interfaces'
import { Collection } from './Collection'
import { error } from './helpers/utils'

export class ResponseView<T extends ISingleOrMulti<PureModel>> {
  public data: T | null = null
  public meta: object
  public headers?: Headers
  public requestHeaders?: IDictionary<string>
  public error?: IError[] | Error
  public status?: number
  public views: View[] = []

  public readonly collection?: PureCollection
  public readonly requestOptions?: IRequestOptions
  public readonly rawResponse: IRawResponse<$PickOf<T, object[], object>>
  public readonly modelType: IType

  constructor(
    rawResponse: IRawResponse<$PickOf<T, object[], object>>,
    collection?: PureCollection,
    requestOptions?: IRequestOptions,
    overrideData?: T,
    views?: View[]
  ) {
    this.collection = collection
    this.requestOptions = requestOptions
    this.rawResponse = rawResponse
    this.modelType = getModelType(rawResponse.data!.type)
    this.status = rawResponse.status

    if (views) {
      this.views = views
    }

    if (collection) {
      this.data = overrideData ? collection.add<T>(overrideData) : (collection as Collection).sync<T>(rawResponse.data)
    } else if (rawResponse.data) {
      // The case when a record is not in a store and save/remove are used
      const resp = rawResponse.data

      if (resp.data) {
        if (resp.data instanceof Array) {
          throw error('A save/remove operation should not return an array of results')
        }

        this.data = overrideData || (new GenericModel(resp.data) as any)
      }
    }

    this.views.forEach((view) => {
      if (this.data) {
        view.add(this.data)
      }
    })

    this.meta = (rawResponse.data && rawResponse.data.meta) || {}
    this.headers = rawResponse.headers
    this.requestHeaders = rawResponse.requestHeaders
    this.error = rawResponse.error
  }

  @action public replace(data: T): ResponseView<T> {
    const record = this.data

    if (record === data) {
      return this
    }

    const newId = getModelId(record!)
    const type = getModelType(record!)

    const viewIndexes = this.views.map((view) => view.list.indexOf(record!))

    if (this.collection) {
      this.collection.removeOne(type, newId)
      this.collection.add(data)
    }

    updateModel(data, modelToJSON(record!))
    updateModelId(data, newId)

    this.views.forEach((view, index) => {
      if (viewIndexes[index] !== -1) {
        view.list[viewIndexes[index]] = data
      }
    })

    return new ResponseView(this.rawResponse, this.collection, this.requestOptions, data)
  }
}
