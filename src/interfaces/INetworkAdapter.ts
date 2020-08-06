/***************************************************
 * Created by nanyuantingfeng on 2019/11/28 16:52. *
 ***************************************************/
import { IRawResponse } from './IRawResponse'
import { IRequestMethod, IRequestOptions } from './IRequestOptions'
import { IIdentifier } from '../datx'
import { IOneOrMany } from './types'

export interface INetworkAdapter {
  prepare(props: {
    endpoint: string
    ids?: IOneOrMany<IIdentifier>
    options?: IRequestOptions
    method?: IRequestMethod
  }): { url: string; options?: any; cacheKey?: string }

  fetch(url: string, options: any): Promise<IRawResponse<any>>

  onError(error: IRawResponse<void>): void
}
