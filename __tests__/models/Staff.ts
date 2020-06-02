/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:49. *
 ***************************************************/
import { Model, prop } from '../../src'
import Department from './Department'

export default class Staff extends Model {
  static type = 'organization.Staff'
  static endpoint = '/organization/staffs/actives'

  @prop.identifier public id: string

  @prop public version: number
  @prop public active: boolean
  @prop public createTime: number
  @prop public updateTime: number

  @prop public name: string
  @prop public nameSpell: string
  @prop public code: string
  @prop public corporationId: string
  @prop public userId: string
  @prop public avatar: string
  @prop public email: string
  @prop public cellphone: string
  @prop public note: string

  @prop.toMany(Department) public departments: Department[]

  @prop.toOne(Department) public defaultDepartment: Department

  @prop public external: boolean

  @prop public order: Record<string, string>

  @prop public corporation: any

  @prop public roles: any
}
