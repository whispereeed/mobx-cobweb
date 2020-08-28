/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:42. *
 ***************************************************/
import { IRawModel } from 'datx-utils'
import { IIdentifier, IModelConstructor, IType, PureCollection, PureModel } from '../datx'
import { IRawResponse } from './IRawResponse'
import { IRequestOptions } from './IRequestOptions'
import { ResponseView } from '../ResponseView'
import { INetworkAdapter } from './INetworkAdapter'
import { IDataRef } from '../helpers/dataref'

export interface INetActionsMixinForModel<T extends PureModel> {
  upsert(options?: IRequestOptions): Promise<this>
  remove(options?: IRequestOptions): Promise<boolean>
  refresh(): Promise<ResponseView<T>>
  request(options: IRequestOptions): Promise<IRawResponse>

  fetchRef(field: string, options?: IRequestOptions): Promise<ResponseView<any>>
  fetchRefs(options?: IRequestOptions): Promise<Array<ResponseView<any>>>
}

export interface INetActionsMixinForCollection<T extends PureCollection> {
  adapter: INetworkAdapter
  setNetworkAdapter(adapter: INetworkAdapter): void

  sync<T extends PureModel>(data: IRawModel[], type: IModelConstructor<T> | IType): T[]
  sync<T extends PureModel>(data: IRawModel, type: IModelConstructor<T> | IType): T

  fetch<T extends PureModel, R = T[]>(
    type: IType | T | IModelConstructor<T>,
    options?: IRequestOptions
  ): Promise<ResponseView<R>>
  fetch<T extends PureModel, R = T[]>(
    type: IType | T | IModelConstructor<T>,
    ids: undefined | null,
    options?: IRequestOptions
  ): Promise<ResponseView<R>>
  fetch<T extends PureModel, R = T>(
    type: IType | T | IModelConstructor<T>,
    id?: IIdentifier,
    options?: IRequestOptions
  ): Promise<ResponseView<R>>
  fetch<T extends PureModel, R = T[]>(
    type: IType | T | IModelConstructor<T>,
    ids?: IIdentifier[],
    options?: IRequestOptions
  ): Promise<ResponseView<R>>

  removeOne(type: IType | typeof PureModel, id: IIdentifier, remote?: boolean | IRequestOptions): Promise<boolean>
  removeOne(model: PureModel, remote?: boolean | IRequestOptions): Promise<boolean>

  request(url: string, options: IRequestOptions): Promise<IRawResponse>

  ffetch<T extends PureModel, R = T[]>(
    type: IType | T | IModelConstructor<T>,
    options?: IRequestOptions
  ): IDataRef<R, ResponseView<any>>
  ffetch<T extends PureModel, R = T[]>(
    type: IType | T | IModelConstructor<T>,
    ids: undefined | null,
    options?: IRequestOptions
  ): IDataRef<R, ResponseView<any>>
  ffetch<T extends PureModel, R = T>(
    type: IType | T | IModelConstructor<T>,
    id?: IIdentifier,
    options?: IRequestOptions
  ): IDataRef<R, ResponseView<any>>
  ffetch<T extends PureModel, R = T[]>(
    type: IType | T | IModelConstructor<T>,
    ids?: IIdentifier[],
    options?: IRequestOptions
  ): IDataRef<R, ResponseView<any>>
}
