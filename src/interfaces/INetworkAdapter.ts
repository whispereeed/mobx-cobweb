/***************************************************
 * Created by nanyuantingfeng on 2019/11/28 16:52. *
 ***************************************************/
import { IResponseData } from './IRawData'
import { IRequestMethod, IRequestOptions } from './IRequestOptions'
import { IIdentifier, IType } from '@issues-beta/datx'
import { ISingleOrMulti } from './types'

export interface INetworkAdapter {
  prepare(props: {
    type: IType
    endpoint: string
    ids?: ISingleOrMulti<IIdentifier>
    options?: IRequestOptions
    method?: IRequestMethod
  }): { url: string; options?: any; cacheKey?: string }

  fetch(url: string, options: any): Promise<IResponseData>

  onError(error: IResponseData): void
}
