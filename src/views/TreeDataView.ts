/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 15:10. *
 ***************************************************/
import { getModelId, getModelType, IModelConstructor, IType, PureModel } from '../datx'
import { Collection } from '../Collection'
import { ListDataView } from './ListDataView'
import { ResponseView } from '../ResponseView'
import { IRequestOptions } from '../interfaces'
import { action, observable } from 'mobx'

export class TreeDataView<T extends PureModel> {
  protected collection: Collection
  protected modelType: IType
  @observable public isLoading: boolean = false

  constructor(modelType: IType | IModelConstructor<T>, collection: Collection) {
    this.modelType = getModelType(modelType)
    this.collection = collection
  }

  @action public async search(options: IRequestOptions): Promise<ResponseView<T[]>> {
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, options)
    this.isLoading = false
    return response
  }
  @action public async fetchChildren(model: PureModel): Promise<ListDataView<T>> {
    const id = getModelId(model)
    this.isLoading = true
    const listDataView = new ListDataView<T>(this.modelType, this.collection)
    await listDataView.search({
      action: `/${id}/children`,
      selector: { limit: [0, 10] }
    })
    this.isLoading = false
    return listDataView
  }
  @action public async fetchParents(model: PureModel): Promise<ResponseView<T[]>> {
    const id = getModelId(model)
    this.isLoading = true
    const response = await this.collection.fetch<T>(this.modelType, { action: `/${id}/parents` })
    this.isLoading = false
    return response
  }
}
