/***************************************************
 * Created by nanyuantingfeng on 2020/7/21 11:40. *
 ***************************************************/
import { Model } from './Model'
import { attribute } from './index'

export class OrphanModel extends Model {
  static enableAutoId = false
  static __$orphan_id__ = '__$orphan_id__(0)'
  static preprocess(data: any = {}) {
    data.__$orphan_id__ = OrphanModel.__$orphan_id__
    return data
  }

  @attribute({ isIdentifier: true }) private __$orphan_id__: number
}
