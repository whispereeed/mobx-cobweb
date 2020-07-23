/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { identifier, Model, property, referenceMany, referenceOne } from '../../src'
import Department from './Department'

export default class Staff extends Model {
  static type = 'organization.Staff'
  static endpoint = '/organization/staffs/actives'

  @identifier public id: string

  @property public version: number
  @property public active: boolean
  @property public createTime: number
  @property public updateTime: number

  @property public name: string
  @property public nameSpell: string
  @property public code: string
  @property public corporationId: string
  @property public userId: string
  @property public avatar: string
  @property public email: string
  @property public cellphone: string
  @property public note: string

  @referenceMany(Department) public departments: Department[]
  @referenceOne(Department) public defaultDepartment: Department

  @property public external: boolean
  @property public order: Record<string, string>
  @property public corporation: any
  @property public roles: any
}
