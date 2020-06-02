/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:42. *
 ***************************************************/

import { PureModel } from 'datx'
import { IRequestOptions } from './IRequestOptions'

export interface INetActionsMixin<T = PureModel> {
  save(options?: IRequestOptions): Promise<this>
  remove(options?: IRequestOptions): Promise<void>
  fetchRefs(): Promise<void>
}
