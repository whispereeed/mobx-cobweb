/***************************************************
 * Created by nanyuantingfeng on 2019/12/3 12:24. *
 ***************************************************/
import { IResponseView, ISimpleDataView, ISkeletonModel } from '../../interfaces'
import { ResponseView } from '../ResponseView'
import { observable } from 'mobx'
import { fetchModelRefs } from '../..'

export class SimpleDataView<T extends ISkeletonModel> extends ResponseView<T> implements ISimpleDataView<T> {
  data: T

  @observable isLoading: boolean

  meta: {
    timestamp: number
  }

  constructor(response: IResponseView<T>, overrideData?: T | Array<T>) {
    super(response.rawResponse, response.collection, response.requestOptions, overrideData, response.views)
  }

  fetchRefs() {
    return fetchModelRefs(this.data)
  }
}
