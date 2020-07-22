/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:27. *
 ***************************************************/
import { Model, prop } from '../../src'

export default class Payee extends Model {
  static type = 'form.Payees.Mine'
  static endpoint = '/form/payees/mine'

  @prop.identifier public id: string

  @prop public version: number
  @prop public active: boolean
  @prop public createTime: number
  @prop public updateTime: number

  @prop public name: string
  @prop public nameSpell: string
  @prop public code: string
  @prop public corporationId: any
  @prop public type: string //  "PERSONAL"

  @prop public owner: string // CORPORATION
  @prop public cardNo: string
  @prop public logs: Array<{
    action: string // "CREATE"
    operatorId: string
    time: number
    attributes: any
  }>
  @prop public sort: string // "BANK"

  @prop public staffId: string
  @prop public visibility: {
    fullVisible: boolean
    staffs: null
    roles: null
    departments: null
    departmentsIncludeChildren: boolean
  }

  @prop public branch: string
  @prop public icon: string
  @prop public bank: string
  @prop public province: string

  @prop public city: string
  @prop public certificateType: string
  @prop public certificateNo: string
  @prop public bankLinkNo: string
  @prop public unionIcon: string
  @prop public unionBank: string
  @prop public isDefault: boolean
}
