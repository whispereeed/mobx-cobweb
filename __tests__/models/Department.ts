/***************************************************
 * Created by nanyuantingfeng on 2019/11/29 11:53. *
 ***************************************************/
import { identifier, Model, property, referenceMany, referenceOne } from '../../src'

export default class Department extends Model {
  static type = 'organization.Department'
  static endpoint = '/organization/departments'

  @identifier public id: string

  @property public version: number
  @property public active: boolean
  @property public createTime: number
  @property public updateTime: number

  @property public name: string
  @property public nameSpell: string
  @property public code: string
  @property public corporationId: any

  @referenceOne(Department) public parentId: Department
  @referenceMany(Department) public children: Department[]

  @property public order: number
}
