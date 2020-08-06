/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { Collection as _Collection, IModelConstructor, IType, PureModel } from './datx'
import { withStorage } from './mixins/withStorage'
import { ORPHAN_MODEL_ID_VAL } from './helpers/consts'
import { withNetActions } from './mixins/withNetActions'

import { ICollectionConstructor } from './datx'
import { IStorageMixin, IStorageConfig } from './interfaces/IStorageMixin'
import { INetActionsMixinForCollection } from './interfaces/INetActionsMixin'

export class Collection extends withStorage(withNetActions(_Collection)) {
  static register<T extends PureModel>(O: IModelConstructor<T>) {
    if (!this.types.find((Q) => Q.type === O.type)) {
      this.types.push(O)
    }
  }

  register<T extends PureModel>(O: IModelConstructor<T>) {
    ;((this.constructor as unknown) as Collection).register(O)
  }

  findOrphan<T extends PureModel>(model?: IType | IModelConstructor<T>): T {
    return this.findOne(model, ORPHAN_MODEL_ID_VAL)
  }
}
