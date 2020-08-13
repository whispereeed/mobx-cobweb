/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { Collection as _Collection, IModelConstructor, IType, PureModel } from './datx'
import { mapItems } from 'datx-utils'
import { withStorage } from './mixins/withStorage'
import { ORPHAN_MODEL_ID_VAL } from './helpers/consts'
import { withNetActions } from './mixins/withNetActions'

import { ICollectionConstructor } from './datx'
import { IStorageMixin, IStorageType } from './interfaces/IStorageMixin'
import { INetActionsMixinForCollection } from './interfaces/INetActionsMixin'

export class Collection extends withStorage(withNetActions(_Collection)) {
  static register<T extends PureModel>(O: IModelConstructor<T> | IModelConstructor<T>[]) {
    return mapItems(O, (_O: IModelConstructor<T>) => {
      if (!this.types.find((_T) => _T.type === _O.type)) {
        this.types.push(_O)
      }
    })
  }

  register<T extends PureModel>(O: IModelConstructor<T> | IModelConstructor<T>[]) {
    ;((this.constructor as unknown) as Collection).register(O)
  }

  findOrphan<T extends PureModel>(model?: IType | IModelConstructor<T>): T {
    return this.findOne(model, ORPHAN_MODEL_ID_VAL)
  }
}
