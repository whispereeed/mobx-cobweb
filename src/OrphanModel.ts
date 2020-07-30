/***************************************************
 * Created by nanyuantingfeng on 2020/7/21 11:40. *
 ***************************************************/
import { action } from 'mobx'
import { Model } from './Model'
import { Attribute, PureCollection, getModelCollection, getModelType } from './datx'
import { ResponseView } from './ResponseView'
import { ORPHAN_MODEL_ID_KEY, ORPHAN_MODEL_ID_VAL } from './helpers/consts'
import { INetPatchesMixin } from './interfaces/INetPatchesMixin'
import { error } from './helpers/utils'

export class OrphanModel extends Model {
  static enableAutoId = true

  static preprocess(data: any = {}) {
    data[ORPHAN_MODEL_ID_KEY] = ORPHAN_MODEL_ID_VAL
    return data
  }

  @Attribute({ isIdentifier: true })
  public [ORPHAN_MODEL_ID_KEY]: string

  @action public refresh(): Promise<ResponseView<this>> {
    const collection: INetPatchesMixin<PureCollection> = getModelCollection(this) as any
    if (!collection) {
      throw error(`before calling model.refresh API, add the model to the collection first.`)
    }
    return collection.fetch<this, this>(getModelType(this))
  }
}
