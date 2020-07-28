/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { Collection as _Collection, IModelConstructor, IType, PureModel, ICollectionConstructor } from './datx'
import { withNetPatches } from './mixins/withNetPatches'
import { withStorage } from './mixins/withStorage'
import { INetPatchesCollectionMixin } from './interfaces/INetPatchesCollectionMixin'
import { IStorageCollectionMixin } from './interfaces/IStorageCollectionMixin'
import { ORPHAN_MODEL_ID_VAL } from './helpers/consts'

const WithNetPatchesCollection: ICollectionConstructor<
  IStorageCollectionMixin<_Collection> & INetPatchesCollectionMixin<_Collection> & _Collection
> = withStorage(withNetPatches(_Collection))

export class Collection extends WithNetPatchesCollection {
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
