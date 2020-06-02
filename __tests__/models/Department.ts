/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:53. *
 ***************************************************/
import { Model, prop } from '../../src'

export default class Department extends Model {
  static type = 'organization.Department'
  static endpoint = '/organization/departments'

  @prop.identifier public id: string

  @prop public version: number
  @prop public active: boolean
  @prop public createTime: number
  @prop public updateTime: number

  @prop public name: string
  @prop public nameSpell: string
  @prop public code: string
  @prop public corporationId: any

  @prop.toOne(Department) public parentId: Department
  @prop.toMany(Department) public children: Department[]

  @prop public order: number
}
