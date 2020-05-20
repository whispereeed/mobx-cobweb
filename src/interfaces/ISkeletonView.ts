/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IIdentifier, View } from 'datx'

import { IResponseView } from './IResponseView'
import { ISkeletonModel } from './ISkeletonModel'
import { IRequestOptions } from './IRequestOptions'
import { IRawData } from './IRawData'

export interface ISkeletonView<T extends ISkeletonModel = ISkeletonModel> extends View<T> {
  sync(data?: IRawData): T | Array<T> | null

  fetch(id: IIdentifier | IIdentifier[], options?: IRequestOptions): Promise<IResponseView<T>>

  fetch(options?: IRequestOptions): Promise<IResponseView<T>>
}
