/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IType, PureCollection, PureModel, View } from '../datx'

import { getCache, saveCache } from './cache'
import { error, getValue, isBrowser } from './utils'

import { IRequestOptions, IRawResponse, IOneOrMany, IRequestMethod } from '../interfaces'
import { ResponseView } from '../ResponseView'
import { INetPatchesMixin } from '../interfaces/INetPatchesMixin'

async function __doFetch<M extends IOneOrMany<PureModel>>(doFetchOptions: {
  collection: INetPatchesMixin<PureCollection> & PureCollection
  options: IRequestOptions
  modelType?: IType
  method: IRequestMethod
  ids?: IOneOrMany<IIdentifier>
  views?: View[]
}): Promise<ResponseView<M>> {
  const { options, method = 'GET', collection, views, modelType, ids } = doFetchOptions

  const prepared = collection.adapter.prepare({
    endpoint: getModelEndpointURL(modelType, collection),
    ids,
    options,
    method
  })

  const skipCache = options?.skipCache

  if (isBrowser && !skipCache && prepared.cacheKey) {
    const _response = getCache(prepared.cacheKey, modelType)
    if (_response) {
      // console.info(`cache captured at ${prepared.cacheKey}`)
      return Promise.resolve((_response as unknown) as ResponseView<M>)
    }
  }

  const rawResponse = await collection.adapter.fetch(prepared.url, prepared.options)

  rawResponse.modelType = modelType
  rawResponse.collection = collection

  const response = new ResponseView<M>(rawResponse, collection, options, undefined, views)

  if (isBrowser && !skipCache && prepared.cacheKey) {
    saveCache(prepared.cacheKey, modelType, response)
  }

  return response
}

export function getModelEndpointURL(type: IType, collection: PureCollection): string {
  const StaticCollection = collection.constructor as typeof PureCollection
  const QueryModel: any = StaticCollection.types.find((item) => item.type === type)

  if (!QueryModel) {
    throw error(`No definition for endpoint was found at Collection<${type}>`)
  }

  const endpoint = getValue<string>(QueryModel.endpoint)

  if (!endpoint) {
    throw error(`No definition for endpoint was found at Model<${type}>`)
  }

  return endpoint
}

export function query<M extends IOneOrMany<PureModel>>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: INetPatchesMixin<PureCollection> & PureCollection,
  views?: View[],
  ids?: IOneOrMany<IIdentifier>
): Promise<ResponseView<M>> {
  return __doFetch<M>({
    modelType,
    options,
    collection,
    views,
    ids,
    method: 'GET'
  })
}

export function upsert<T extends PureModel>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: INetPatchesMixin<PureCollection> & PureCollection,
  views?: View[]
): Promise<ResponseView<T>> {
  return __doFetch<T>({
    modelType,
    collection,
    options,
    views,
    method: 'POST'
  })
}

export function remove<T extends PureModel>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: INetPatchesMixin<PureCollection> & PureCollection,
  views?: View[]
): Promise<ResponseView<T>> {
  return __doFetch<T>({
    modelType,
    collection,
    options,
    views,
    method: 'DELETE'
  })
}

export async function request<D>(
  collection: INetPatchesMixin<PureCollection> & PureCollection,
  endpoint: string,
  options: IRequestOptions
): Promise<IRawResponse<D>> {
  const prepared = await collection.adapter.prepare({
    endpoint: endpoint,
    options,
    method: options.method
  })
  const rawResponse = await collection.adapter.fetch(prepared.url, prepared.options)
  rawResponse.collection = collection
  return rawResponse
}
