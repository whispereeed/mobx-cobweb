/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:55. *
 ***************************************************/
import { Collection as _Collection, IModelConstructor, PureModel } from 'datx'
import { withNetPatches } from './mixins/withNetPatches'

export class Collection extends withNetPatches(_Collection) {
  static register<T extends PureModel>(O: IModelConstructor<T>) {
    if (!this.types.find((Q) => Q === O)) {
      this.types.push(O)
    }
  }
}
