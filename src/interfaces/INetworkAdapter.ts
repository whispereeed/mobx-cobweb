/***************************************************
 * Created by nanyuantingfeng on 2019/11/28 16:52. *
 ***************************************************/
import { IResponseData } from './IRawData'
import { IRequestOptions } from './IRequestOptions'
import { IIdentifier, IType } from 'datx'

export interface INetworkAdapter {
  prepare(props: {
    type: IType
    endpoint: string
    ids?: IIdentifier | IIdentifier[]
    options?: IRequestOptions
    method?: string
  }): {
    url: string
    options?: any
    cacheKey: string
  }

  fetch(url: string, options: any): Promise<IResponseData>

  onError(error: IResponseData): void
}
