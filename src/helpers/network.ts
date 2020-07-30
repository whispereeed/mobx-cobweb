/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IType, PureCollection, PureModel, View } from '../datx'

import { getCache, saveCache } from './cache'
import { error, getValue, isBrowser } from './utils'

import { IRequestOptions, IRawResponse, IResponseData, ISingleOrMulti, IRequestMethod } from '../interfaces'
import { ResponseView } from '../ResponseView'
import { INetPatchesMixin } from '../interfaces/INetPatchesMixin'

function __packResponse<T>(
  responseData: IResponseData<any>,
  modelType: IType,
  collection: PureCollection
): IRawResponse<T> {
  const { data = {} as any, ...others } = responseData
  // data : {data : * , meta : *}
  data.type = modelType
  return { ...others, data, collection }
}

async function __doFetch<M extends ISingleOrMulti<PureModel>>(doFetchOptions: {
  collection: INetPatchesMixin<PureCollection> & PureCollection
  options: IRequestOptions
  modelType?: IType
  method: IRequestMethod
  ids?: ISingleOrMulti<IIdentifier>
  views?: View[]
}): Promise<ResponseView<M>> {
  const { options, method = 'GET', collection, views, modelType, ids } = doFetchOptions

  const prepared = collection.adapter.prepare({
    type: modelType,
    endpoint: getModelEndpointURL(modelType, collection),
    ids,
    options,
    method
  })

  const staticCollection = collection && (collection.constructor as { cache?: boolean })
  const collectionCache = staticCollection && staticCollection.cache
  const isCacheSupported = method.toUpperCase() === 'GET'
  const skipCache = options?.skipCache

  if (isBrowser && isCacheSupported && collectionCache && !skipCache && prepared.cacheKey) {
    const _response = getCache(prepared.cacheKey, modelType)
    if (_response) {
      // console.info(`cache captured at ${prepared.cacheKey}`)
      return Promise.resolve((_response as unknown) as ResponseView<M>)
    }
  }

  const fetchResponse = await collection.adapter.fetch(prepared.url, prepared.options)
  const response = new ResponseView<M>(
    __packResponse(fetchResponse, modelType, collection),
    collection,
    options,
    undefined,
    views
  )

  if (isBrowser && isCacheSupported) {
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

export function query<M extends ISingleOrMulti<PureModel>>(
  modelType: IType,
  options?: IRequestOptions,
  collection?: INetPatchesMixin<PureCollection> & PureCollection,
  views?: View[],
  ids?: ISingleOrMulti<IIdentifier>
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
