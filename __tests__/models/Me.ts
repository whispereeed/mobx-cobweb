/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { attribute, OrphanModel } from '../../src'
import Staff from './Staff'

export default class Me extends OrphanModel {
  static type = 'organization.Staff.Me'
  static endpoint = '/organization/staffs/me'

  @attribute({ toOne: Staff }) public staff: Staff
}
