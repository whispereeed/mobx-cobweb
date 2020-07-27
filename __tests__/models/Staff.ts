/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { attribute, Model } from '../../src'
import Department from './Department'

export default class Staff extends Model {
  static type = 'organization.Staff'
  static endpoint = '/organization/staffs/actives'

  @attribute({ isIdentifier: true }) public id: string

  @attribute() public name: string
  @attribute() public code: string

  @attribute({ toMany: Department }) public departments: Department[]
  @attribute({ toOne: Department }) public defaultDepartment: Department
}
