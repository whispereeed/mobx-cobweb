/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 12:24. *
 ***************************************************/
import { IListDataView, IResponseView, ISimpleDataView, ISkeletonModel, ITreeDataView } from '../interfaces'
import { ResponseView } from '../implements/ResponseView'
import { IIdentifier } from 'datx'
import { observable } from 'mobx'

export class TreeDataView<T extends ISkeletonModel> extends ResponseView<T> implements ITreeDataView<T> {
  data: T[]

  @observable isLoading: boolean

  meta: {
    count: number
  }

  constructor(response: IResponseView<T>, overrideData?: T | Array<T>) {
    super(response.rawResponse, response.collection, response.requestOptions, overrideData, response.views)
  }

  fetchChildrenNodes(model: IIdentifier | T): Promise<IListDataView<T>> {
    this.isLoading = true

    this.isLoading = false
    return undefined
  }

  fetchNode(model?: IIdentifier | T): Promise<ISimpleDataView<T>> {
    this.isLoading = true

    this.isLoading = false
    return undefined
  }

  fetchParentNode(model: IIdentifier | T): Promise<ISimpleDataView<T>> {
    this.isLoading = true

    this.isLoading = false
    return undefined
  }

  fetchChainNodes(model: IIdentifier | T): Promise<IResponseView<T>> {
    this.isLoading = true

    this.isLoading = false
    return undefined
  }

  findChildrenNodes(model: IIdentifier | T): T[] {
    const current = (this.findOne(model) as unknown) as { children: IIdentifier[] }
    const children = current.children
    return children.map((id) => this.findOne(id))
  }

  findOne(model?: IIdentifier | T): T {
    return this.collection.findOne<T>(this.modelType, model)
  }

  findParentNode(model: IIdentifier | T): T {
    const current = (this.findOne(model) as unknown) as { parentId: IIdentifier }
    return this.collection.findOne<T>(this.modelType, current.parentId)
  }
}
