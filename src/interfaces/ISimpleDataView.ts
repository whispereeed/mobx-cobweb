/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 09:36. *
 ***************************************************/
import { ISkeletonModel } from './ISkeletonModel'
import { IResponseView } from './IResponseView'

export interface ISimpleDataView<T extends ISkeletonModel> extends IResponseView<T> {
  data: T

  isLoading: boolean
}
