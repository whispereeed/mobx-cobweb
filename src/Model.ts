/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:53. *
 ***************************************************/
import { Model as _Model } from 'datx'
import { withNetActions } from './mixins/withNetActions'

export class Model extends withNetActions(_Model) {
  toString() {
    return JSON.stringify(this.valueOf())
  }
}
