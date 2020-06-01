/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, IModelConstructor, IType, IViewConstructor, PureModel, View } from 'datx'

import { ISkeletonCollection, ISkeletonModel, IRequestOptions } from '../interfaces'
import { ResponseView } from './ResponseView'

export function decorateView<U>(BaseClass: typeof View) {
  class SkeletonView<M extends ISkeletonModel> extends BaseClass<M> {}

  return (SkeletonView as unknown) as IViewConstructor<ISkeletonModel>
}
