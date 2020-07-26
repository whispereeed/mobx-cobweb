/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 10:26. *
 ***************************************************/
import { attribute, Model } from '../../src'

interface IMenuAvailableRange {
  fullVisible: boolean
  chargeCodes: string[]
  permissions: string[]
  visibility: any
}

export default class Menu extends Model {
  static type = 'menu.Menus'
  static endpoint = '/menu/menus'

  @attribute({ isIdentifier: true }) public id: string

  @attribute() public version: number
  @attribute() public active: boolean
  @attribute() public createTime: number
  @attribute() public updateTime: number

  @attribute() public deviceType: string // "DESKTOP"
  @attribute() public label: string
  @attribute() public icon: string
  @attribute() public color: string
  @attribute() public showType: string // "SIMPLE"
  @attribute() public selected: boolean

  @attribute({ toOne: Menu }) public pid: Menu

  @attribute() public condition: string
  @attribute() public weight: number
  @attribute() public dynamicSupportValue: boolean
  @attribute() public type: string // "MENU"
  @attribute() public code: string // "homepage"
  @attribute() public availableRange: Partial<IMenuAvailableRange>
}
