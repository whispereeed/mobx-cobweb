/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { Model, property, referenceOne } from '../../src'
import Staff from './Staff'

export default class Me extends Model {
  static type = 'organization.Staff.Me'
  static endpoint = '/organization/staffs/me'

  @referenceOne(Staff) public staff: Staff
  @property home5: boolean
  @property isAuthorized: boolean
  @property permissions: string[]
}
