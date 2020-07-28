/***************************************************
 * Created by nanyuantingfeng on 2020/7/21 11:40. *
 ***************************************************/
import { Model } from './Model'
import { attribute } from './index'
import { ORPHAN_MODEL_ID_KEY, ORPHAN_MODEL_ID_VAL } from './helpers/consts'

export class OrphanModel extends Model {
  static enableAutoId = true

  static preprocess(data: any = {}) {
    data[ORPHAN_MODEL_ID_KEY] = ORPHAN_MODEL_ID_VAL
    return data
  }

  @attribute({ isIdentifier: true })
  public [ORPHAN_MODEL_ID_KEY]: string
}
