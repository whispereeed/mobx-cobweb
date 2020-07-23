/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:27. *
 ***************************************************/
import { identifier, Model, property } from '../../src'

export default class Payee extends Model {
  static type = 'form.Payees.Mine'
  static endpoint = '/form/payees/mine'

  @identifier public id: string

  @property public version: number
  @property public active: boolean
  @property public createTime: number
  @property public updateTime: number

  @property public name: string
  @property public nameSpell: string
  @property public code: string
  @property public corporationId: any
  @property public type: string //  "PERSONAL"

  @property public owner: string // CORPORATION
  @property public cardNo: string
  @property public logs: Array<{
    action: string // "CREATE"
    operatorId: string
    time: number
    attributes: any
  }>
  @property public sort: string // "BANK"

  @property public staffId: string
  @property public visibility: {
    fullVisible: boolean
    staffs: null
    roles: null
    departments: null
    departmentsIncludeChildren: boolean
  }

  @property public branch: string
  @property public icon: string
  @property public bank: string
  @property public province: string

  @property public city: string
  @property public certificateType: string
  @property public certificateNo: string
  @property public bankLinkNo: string
  @property public unionIcon: string
  @property public unionBank: string
  @property public isDefault: boolean
}
