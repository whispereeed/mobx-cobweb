/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { attribute, SingletonModel } from '../../src'
import Staff from './Staff'

export default class Me extends SingletonModel {
  static type = 'organization.Staff.Me'
  static endpoint = '/organization/staffs/me'

  @attribute() home5: boolean
  @attribute() isAuthorized: boolean
  @attribute() permissions: string[]

  @attribute({ toOne: Staff }) public staff: Staff
}
