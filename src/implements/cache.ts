/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { getModelType, IType } from 'datx'

import { ISkeletonModel, IResponseView } from '../interfaces'

export interface ICache {
  response: IResponseView<ISkeletonModel>
  timestamp: number
  type: IType
  url: string
}

let cacheStorage: Array<ICache> = []

export function saveCache(url: string, response: IResponseView<ISkeletonModel>, modelType?: string) {
  if (response && 'data' in response && (!('error' in response) || !response.error) && response.data) {
    // The type might need to be 100% correct - used only to clear the cache
    const type = modelType || getModelType(response.data instanceof Array ? response.data[0] : response.data)
    cacheStorage.push({ response, timestamp: Date.now(), type, url })
  }
}

export function getCache(url: string): ICache | undefined {
  return cacheStorage.find(item => item.url === url)
}

export function clearAllCache() {
  cacheStorage.length = 0
}

export function clearCacheByType(type: IType) {
  cacheStorage = cacheStorage.filter(item => item.type !== type)
}
