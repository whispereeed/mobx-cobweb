/***************************************************
 * Created by nanyuantingfeng on 2020/7/27 16:40. *
 ***************************************************/
import { PureModel, IModelConstructor } from '../datx'

export function withStorageForModel<T extends PureModel>(Base: IModelConstructor<T>) {
  const BaseClass = Base as typeof PureModel

  return BaseClass as IModelConstructor<T> & {
    enableStorage: boolean
  }
}
