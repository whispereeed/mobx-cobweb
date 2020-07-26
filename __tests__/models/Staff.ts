/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { attribute, Model } from '../../src'
import Department from './Department'

export default class Staff extends Model {
  static type = 'organization.Staff'
  static endpoint = '/organization/staffs/actives'

  @attribute({ isIdentifier: true }) public id: string

  @attribute() public version: number
  @attribute() public active: boolean
  @attribute() public createTime: number
  @attribute() public updateTime: number

  @attribute() public name: string
  @attribute() public nameSpell: string
  @attribute() public code: string
  @attribute() public corporationId: string
  @attribute() public userId: string
  @attribute() public avatar: string
  @attribute() public email: string
  @attribute() public cellphone: string
  @attribute() public note: string

  @attribute({ toMany: Department }) public departments: Department[]
  @attribute({ toOne: Department }) public defaultDepartment: Department

  @attribute() public external: boolean
  @attribute() public order: Record<string, string>
  @attribute() public corporation: any
  @attribute() public roles: any
}
