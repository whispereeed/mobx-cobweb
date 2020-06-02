/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IType, PureCollection, PureModel, View } from 'datx'

import { getCache, saveCache } from './cache'
import { getValue, isBrowser } from './utils'

import { IRequestOptions, IRawResponse, INetworkAdapter, IResponseData, $PickOf } from '../interfaces'

import { ResponseView } from '../ResponseView'

const config: { cache: boolean; adapter: INetworkAdapter } = {
  cache: isBrowser,
  adapter: null
}

function packResponse<O>(responseData: IResponseData, modelType: IType, collection: PureCollection): IRawResponse<O> {
  const { data = {}, ...others } = responseData
  // data : {data : * , meta : *}
  data.type = modelType

  return {
    ...others,
    data,
    collection
  }
}

function getModelEndpointUrl(type: IType, collection: PureCollection): string {
  const StaticCollection = collection.constructor as typeof PureCollection
  const QueryModel: any = StaticCollection.types.filter((item) => item.type === type)[0]
  const endpoint = getValue<string>(QueryModel['endpoint'])

  if (!endpoint) {
    throw `No definition for endpoint was found at Model<${type}>`
  }

  return endpoint
}

interface ICollectionFetchOpts {
  modelType?: IType
  options?: IRequestOptions
  method?: string
  collection?: PureCollection
  ids?: IIdentifier | IIdentifier[]
  views?: Array<View>
}

async function collectionFetch<M extends PureModel | PureModel[]>(
  reqOptions: ICollectionFetchOpts
): Promise<ResponseView<M>> {
  const { options, method = 'GET', collection, views, modelType, ids } = reqOptions

  const prepared = config.adapter.prepare({
    type: modelType,
    endpoint: getModelEndpointUrl(modelType, collection),
    ids: ids,
    options,
    method
  })

  const staticCollection = collection && (collection.constructor as { cache?: boolean })
  const collectionCache = staticCollection && staticCollection.cache
  const isCacheSupported = method.toUpperCase() === 'GET'
  const skipCache = reqOptions.options && reqOptions.options.skipCache

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

export function query<M extends PureModel | PureModel[]>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: PureCollection,
  views?: Array<View>,
  ids?: IIdentifier | IIdentifier[]
): Promise<ResponseView<M>> {
  return collectionFetch<M>({
    modelType,
    options,
    collection,
    views,
    ids,
    method: 'GET'
  })
}

export function create<T extends PureModel>(
  collection?: PureCollection,
  options?: IRequestOptions,
  views?: View[]
): Promise<ResponseView<T>> {
  return collectionFetch<T>({
    collection,
    method: 'POST',
    options: options,
    views
  })
}

export function update<T extends PureModel>(
  collection?: PureCollection,
  options?: IRequestOptions,
  views?: View[]
): Promise<ResponseView<T>> {
  return collectionFetch<T>({
    collection,
    method: 'PATCH',
    options: options,
    views
  })
}

export function remove<T extends PureModel>(
  collection?: PureCollection,
  options?: IRequestOptions,
  views?: View[]
): Promise<ResponseView<T>> {
  return collectionFetch<T>({
    collection,
    method: 'DELETE',
    options: options,
    views
  })
}
