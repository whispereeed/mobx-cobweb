/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:42. *
 ***************************************************/
import { IRequestOptions } from './IRequestOptions'
import { PureModel } from 'datx'

export interface INetActionsMixin<T = PureModel> {
  save(options?: IRequestOptions): Promise<this>
  remove(options?: IRequestOptions): Promise<void>
  fetchRefs(options?: IRequestOptions): Promise<void>
}
