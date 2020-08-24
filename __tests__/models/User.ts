/***************************************************
 * Created by nanyuantingfeng on 2020/8/24 14:38. *
 ***************************************************/
import { attribute, Model } from '../../src'

export class User extends Model {
  static type = 'organization.User'
  static endpoint = '/organization/users'

  @attribute({ isIdentifier: true }) public id: string
  @attribute() public name: string
  @attribute() public code: string
}
