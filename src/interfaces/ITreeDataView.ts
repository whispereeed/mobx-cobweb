/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 09:36. *
 ***************************************************/
import { ISkeletonModel } from './ISkeletonModel'
import { IListDataView } from './IListDataView'
import { IIdentifier } from 'datx'
import { ISimpleDataView } from './ISimpleDataView'
import { IResponseView } from './IResponseView'

export interface ITreeDataView<T extends ISkeletonModel> extends IResponseView<T> {
  data: T[]

  isLoading: boolean

  meta: {
    count: number
  }

  findOne(model?: IIdentifier | T): T

  findParentNode(model: IIdentifier | T): T

  findChildrenNodes(model: IIdentifier | T): T[]

  fetchNode(model?: IIdentifier | T): Promise<ISimpleDataView<T>>

  fetchChildrenNodes(model: IIdentifier | T): Promise<IListDataView<T>>

  fetchParentNode(model: IIdentifier | T): Promise<ISimpleDataView<T>>

  fetchChainNodes(model: IIdentifier | T): Promise<IResponseView<T>>
}
