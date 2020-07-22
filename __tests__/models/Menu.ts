/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 10:26. *
 ***************************************************/
import { Model, prop } from '../../src'

interface IMenuAvailableRange {
  fullVisible: boolean
  chargeCodes: string[]
  permissions: string[]
  visibility: any
}

export default class Menu extends Model {
  static type = 'menu.Menus'
  static endpoint = '/menu/menus'

  @prop.identifier public id: string

  @prop public version: number
  @prop public active: boolean
  @prop public createTime: number
  @prop public updateTime: number

  @prop public deviceType: string // "DESKTOP"
  @prop public label: string
  @prop public icon: string
  @prop public color: string
  @prop public showType: string // "SIMPLE"
  @prop public selected: boolean

  @prop.toOne(Menu) public pid: Menu

  @prop public condition: string
  @prop public weight: number
  @prop public dynamicSupportValue: boolean
  @prop public type: string // "MENU"
  @prop public code: string // "homepage"
  @prop public availableRange: Partial<IMenuAvailableRange>
}
