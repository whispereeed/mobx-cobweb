/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:42. *
 ***************************************************/
import { IRequestOptions } from './IRequestOptions'
import { PureModel } from '../datx'
import { ResponseView } from '../ResponseView'

export interface INetActionsMixin<T = PureModel> {
  upsert(options?: IRequestOptions): Promise<this>
  remove(options?: IRequestOptions): Promise<void>
  refresh(): Promise<ResponseView<T>>

  fetchRef(field: string, options?: IRequestOptions): Promise<ResponseView<any>>
  fetchRefs(options?: IRequestOptions): Promise<Array<ResponseView<any>>>
}
