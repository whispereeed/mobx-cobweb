/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IType, PureCollection, PureModel, View } from '../datx'
import { getCache, saveCache } from './cache'
import { isBrowser } from './utils'

import { IRequestOptions, IRawResponse, IOneOrMany, IRequestMethod } from '../interfaces'
import { ResponseView } from '../ResponseView'
import { INetActionsMixinForCollection } from '../interfaces/INetActionsMixin'
import { getModelEndpoint } from './api'

export async function modelRequest<M extends IOneOrMany<PureModel>>(doFetchOptions: {
  collection: INetActionsMixinForCollection<PureCollection> & PureCollection
  options: IRequestOptions
  modelType?: IType
  method: IRequestMethod
  ids?: IOneOrMany<IIdentifier>
  views?: View[]
}): Promise<ResponseView<M>> {
  const { options, method = 'GET', collection, views, modelType, ids } = doFetchOptions

  const prepared = collection.adapter.prepare({
    endpoint: getModelEndpoint(modelType, collection),
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

export async function simpleRequest(
  collection: INetActionsMixinForCollection<PureCollection> & PureCollection,
  endpoint: string,
  options: IRequestOptions
): Promise<IRawResponse> {
  const prepared = await collection.adapter.prepare({
    endpoint: endpoint,
    options,
    method: options.method
  })
  const rawResponse = await collection.adapter.fetch(prepared.url, prepared.options)
  rawResponse.collection = collection
  return rawResponse
}
