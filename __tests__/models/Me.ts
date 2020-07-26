/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { property, referenceOne, SingletonModel } from '../../src'
import Staff from './Staff'

export default class Me extends SingletonModel {
  static type = 'organization.Staff.Me'
  static endpoint = '/organization/staffs/me'

  @property home5: boolean
  @property isAuthorized: boolean
  @property permissions: string[]

  @referenceOne(Staff) public staff: Staff
}
