/***************************************************
 * Created by nanyuantingfeng on 2020/7/21 11:40. *
 ***************************************************/
import { Model } from './Model'

export class SingletonModel extends Model {
  static enableAutoId = false
  static preprocess(data: any) {
    if (data) data.id = -1
    return data
  }
}
