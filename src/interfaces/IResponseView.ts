/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 11:58. *
 ***************************************************/
import { ISkeletonModel } from './ISkeletonModel'
import { IType, View } from 'datx'
import { IResponseHeaders } from './IResponseHeaders'
import { IHeaders, IError } from './types'
import { ISkeletonCollection } from './ISkeletonCollection'
import { IRequestOptions } from './IRequestOptions'
import { IRawResponse } from './IRawResponse'

export interface IResponseView<T extends ISkeletonModel> {
  /**
   * API rawResponse data (synced with the store)
   */
  data: T | Array<T> | null

  /**
   * API rawResponse metadata
   *
   * @type {object}
   * @memberOf Response
   */
  meta: object

  /**
   * Headers received from the API call
   *
   * @type {IResponseHeaders}
   * @memberOf Response
   */
  headers?: IResponseHeaders

  /**
   * Headers sent to the server
   *
   * @type {IHeaders}
   * @memberOf Response
   */
  requestHeaders?: IHeaders

  /**
   * Request error
   *
   * @type {(Array<IError>|Error)}
   * @memberOf Response
   */
  error?: Array<IError> | Error

  /**
   * Received HTTP status
   *
   * @type {number}
   * @memberOf Response
   */
  status?: number

  readonly collection?: ISkeletonCollection

  readonly requestOptions?: IRequestOptions

  readonly rawResponse: IRawResponse

  readonly modelType: IType

  views: View[]

  replaceData(data: T): IResponseView<T>
}
