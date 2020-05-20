/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
export * from 'datx'
export * from './interfaces'
export * from './implements/helpers/model'

export type { ISkeletonCollection } from './interfaces/ISkeletonCollection'
export type { ISkeletonModel } from './interfaces/ISkeletonModel'
export type { ISkeletonView } from './interfaces/ISkeletonView'
export type { IRawResponse } from './interfaces/IRawResponse'
export type { IRequestOptions } from './interfaces/IRequestOptions'
export type { IResponseView } from './interfaces/IResponseView'

export { ResponseView } from './implements/ResponseView'
export { GenericModel } from './implements/GenericModel'
export { GenericView } from './implements/GenericView'
export { setNetworkAdapter } from './implements/NetworkUtils'
export { clearAllCache, clearCacheByType } from './implements/cache'

export { skeleton } from './mixin'
export * from './views'

export * from './implements/adapter/NetworkAdapter'
