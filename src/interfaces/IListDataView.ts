/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 09:36. *
 ***************************************************/
import { ISkeletonModel } from './ISkeletonModel'
import { IResponseView } from './IResponseView'
import { IRequestOptions } from './IRequestOptions'

export interface IListDataView<T extends ISkeletonModel = ISkeletonModel> extends IResponseView<T> {
  data: T[]

  isLoading: boolean

  meta: {
    count: number
  }

  first(): Promise<this>

  prev(): Promise<this>

  next(): Promise<this>

  last(): Promise<this>

  infinite(start: number, count: number): Promise<this>

  search(options: IRequestOptions): Promise<this>
}
