/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { Collection as _Collection, IModelConstructor, PureModel } from 'datx'
import { withNetPatches } from './mixins/withNetPatches'
import { INetPatchesCollection } from './interfaces/INetPatchesCollection'
import { ICollectionConstructor } from 'datx'

const WithNetPatchesCollection: ICollectionConstructor<_Collection & INetPatchesCollection<_Collection>> = withNetPatches(_Collection)

export class Collection extends WithNetPatchesCollection {
  static register<T extends PureModel>(O: IModelConstructor<T>) {
    if (!this.types.find((Q) => Q === O)) {
      this.types.push(O)
    }
  }

  register<T extends PureModel>(O: IModelConstructor<T>) {
    ;((this.constructor as unknown) as Collection).register(O)
  }
}
