/***************************************************
 * Created by nanyuantingfeng on 2020/7/21 11:40. *
 ***************************************************/
import { Model } from './Model'

const __SingletonModel_ID__ = 'SINGLETON(0)'

export class SingletonModel extends Model {
  static enableAutoId = false
  static preprocess(data: any) {
    if (data) data.id = __SingletonModel_ID__
    return data
  }

  toString() {
    return JSON.stringify(this.valueOf())
  }
}
