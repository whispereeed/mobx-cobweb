/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IType, PureCollection, PureModel, View } from 'datx'

import { getCache, saveCache } from './cache'
import { getValue, isBrowser } from './utils'

import { IRequestOptions, IRawResponse, INetworkAdapter, IResponseData, $PickOf, ISingleOrMulti } from '../interfaces'

import { ResponseView } from '../ResponseView'

const config: { cache: boolean; adapter: INetworkAdapter } = {
  cache: isBrowser,
  adapter: null
}

function packResponse<T>(responseData: IResponseData, modelType: IType, collection: PureCollection): IRawResponse<T> {
  const { data = {} as any, ...others } = responseData
  // data : {data : * , meta : *}
  data.type = modelType

  return {
    ...others,
    data,
    collection
  }
}

function getModelEndpointURL(type: IType, collection: PureCollection): string {
  const StaticCollection = collection.constructor as typeof PureCollection
  const QueryModel: any = StaticCollection.types.filter((item) => item.type === type)[0]
  const endpoint = getValue<string>(QueryModel['endpoint'])

  if (!endpoint) {
    throw `No definition for endpoint was found at Model<${type}>`
  }

  return endpoint
}

interface IDoFetchOptions {
  collection: PureCollection
  options: IRequestOptions
  modelType?: IType
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  ids?: ISingleOrMulti<IIdentifier>
  views?: View[]
}

async function doFetch<M extends ISingleOrMulti<PureModel>>(doFetchOptions: IDoFetchOptions): Promise<ResponseView<M>> {
  const { options, method = 'GET', collection, views, modelType, ids } = doFetchOptions

  const prepared = config.adapter.prepare({
    type: modelType,
    endpoint: getModelEndpointURL(modelType, collection),
    ids: ids,
    options,
    method
  })

  const staticCollection = collection && (collection.constructor as { cache?: boolean })
  const collectionCache = staticCollection && staticCollection.cache
  const isCacheSupported = method.toUpperCase() === 'GET'
  const skipCache = doFetchOptions.options && doFetchOptions.options.skipCache

  if (config.cache && isCacheSupported && collectionCache && !skipCache) {
    const cache = getCache(prepared.cacheKey)
    if (cache) {
      return Promise.resolve((cache.response as unknown) as ResponseView<M>)
    }
  }

  const response1 = await config.adapter.fetch(prepared.url, prepared.options)
  const response2: IRawResponse<$PickOf<M, object[], object>> = packResponse(response1, modelType, collection)
  const collectionResponse = Object.assign(response2, { collection })
  const resp = new ResponseView<M>(collectionResponse, collection, options, undefined, views)

  if (config.cache && isCacheSupported) {
    saveCache(prepared.url, resp)
  }

  return resp
}

export function setNetworkAdapter(adapter: INetworkAdapter) {
  config.adapter = adapter
}

export function query<M extends ISingleOrMulti<PureModel>>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: PureCollection,
  views?: View[],
  ids?: ISingleOrMulti<IIdentifier>
): Promise<ResponseView<M>> {
  return doFetch<M>({
    modelType,
    options,
    collection,
    views,
    ids,
    method: 'GET'
  })
}

export function create<T extends PureModel>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: PureCollection,
  views?: View[]
): Promise<ResponseView<T>> {
  return doFetch<T>({
    modelType,
    collection,
    options,
    views,
    method: 'POST'
  })
}

export function update<T extends PureModel>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: PureCollection,
  views?: View[]
): Promise<ResponseView<T>> {
  return doFetch<T>({
    modelType,
    collection,
    options,
    views,
    method: 'PATCH'
  })
}

export function remove<T extends PureModel>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: PureCollection,
  views?: View[]
): Promise<ResponseView<T>> {
  return doFetch<T>({
    modelType,
    collection,
    options,
    views,
    method: 'DELETE'
  })
}
