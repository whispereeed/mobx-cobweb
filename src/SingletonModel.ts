/***************************************************
 * Created by nanyuantingfeng on 2020/7/21 11:40. *
 ***************************************************/
import { Model } from './Model'

export class SingletonModel extends Model {
  static enableAutoId = false
  static __ID__ = '__SINGLETON_MODEL__ID__(-1)'

  static preprocess(data: any) {
    if (data) {
      data.id = SingletonModel.__ID__
    }
    return data
  }

  toString() {
    return JSON.stringify(this.valueOf())
  }
}
