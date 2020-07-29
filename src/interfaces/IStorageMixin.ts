/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:42. *
 ***************************************************/
import { PureCollection } from '../datx'

export interface IStorageMixin<T = PureCollection> {
  load(): Promise<void>
  recording(): () => void
}
