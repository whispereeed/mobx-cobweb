/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { getModelType, IType, PureModel } from '../datx'
import { ResponseView } from '../ResponseView'
import { IOneOrMany } from '../interfaces'
import { LRU } from './lru'
import { isArrayLike } from 'datx-utils'
import { peekNonNullish } from './utils'

const cache = new LRU<ResponseView<IOneOrMany<PureModel>>>(16, 60000)

export function saveCache(url: string, modelType: IType, response: ResponseView<IOneOrMany<PureModel>>) {
  if (response && 'data' in response && (!('error' in response) || !response.error) && response.data) {
    // The type might need to be 100% correct - used only to clear the cache
    const type = peekNonNullish(
      modelType,
      getModelType(isArrayLike(response.data) && response.data.length ? response.data[0] : response.data)
    )
    cache.set(`${url}@@${type}`, response)
  }
}

export function getCache(url: string, type: IType) {
  return cache.get(`${url}@@${type}`)
}

export function clearCache() {
  cache.clear()
}

export function clearCacheByType(type: IType) {
  cache.forEach((node) => {
    if (String(node.key).endsWith(`@@${type}`)) {
      cache.remove(node.key)
    }
  })
}
