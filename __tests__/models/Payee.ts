/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:27. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class Payee extends Model {
  static type = 'form.Payees.Mine'
  static endpoint = '/form/payees/mine'

  @attribute({ isIdentifier: true }) public id: string

  @attribute() public version: number
  @attribute() public active: boolean
  @attribute() public createTime: number
  @attribute() public updateTime: number

  @attribute() public name: string
  @attribute() public nameSpell: string
  @attribute() public code: string
  @attribute() public corporationId: any
  @attribute() public type: string //  "PERSONAL"

  @attribute() public owner: string // CORPORATION
  @attribute() public cardNo: string
  @attribute() public logs: Array<{
    action: string // "CREATE"
    operatorId: string
    time: number
    attributes: any
  }>
  @attribute() public sort: string // "BANK"

  @attribute() public staffId: string
  @attribute() public visibility: {
    fullVisible: boolean
    staffs: null
    roles: null
    departments: null
    departmentsIncludeChildren: boolean
  }

  @attribute() public branch: string
  @attribute() public icon: string
  @attribute() public bank: string
  @attribute() public province: string

  @attribute() public city: string
  @attribute() public certificateType: string
  @attribute() public certificateNo: string
  @attribute() public bankLinkNo: string
  @attribute() public unionIcon: string
  @attribute() public unionBank: string
  @attribute() public isDefault: boolean
}
