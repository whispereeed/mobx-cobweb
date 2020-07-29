/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { Collection as _Collection, IModelConstructor, IType, PureModel } from './datx'
import { withNetPatches } from './mixins/withNetPatches'
import { withStorage } from './mixins/withStorage'
import { ORPHAN_MODEL_ID_VAL } from './helpers/consts'

import { ICollectionConstructor } from './datx'
import { INetPatchesMixin } from './interfaces/INetPatchesMixin'
import { IStorageMixin } from './interfaces/IStorageMixin'
import { IStorageConfig } from './mixins/withStorage'

export class Collection extends withStorage(withNetPatches(_Collection)) {
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
