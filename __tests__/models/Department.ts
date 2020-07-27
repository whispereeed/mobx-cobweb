/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:53. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class Department extends Model {
  static type = 'organization.Department'
  static endpoint = '/organization/departments'

  @attribute({ isIdentifier: true }) public id: string

  @attribute() public name: string
  @attribute() public code: string

  @attribute({ toOne: Department }) public parentId: Department
  @attribute({ toMany: Department }) public children: Department[]
}
