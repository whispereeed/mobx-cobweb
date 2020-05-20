/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { skeleton, Model, prop } from '../../src'
import Staff  from './Staff'

export default class Me extends skeleton(Model) {
  static type = 'organization.Staff.Me'
  static endpoint = '/organization/staffs/me'

  @prop.toOne(Staff) public staff: Staff
  @prop home5: boolean
  @prop isAuthorized: boolean
  @prop permissions: string[]
}
