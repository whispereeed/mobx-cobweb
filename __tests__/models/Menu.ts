/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 10:26. *
 ***************************************************/
import { identifier, Model, property, referenceOne } from '../../src'

interface IMenuAvailableRange {
  fullVisible: boolean
  chargeCodes: string[]
  permissions: string[]
  visibility: any
}

export default class Menu extends Model {
  static type = 'menu.Menus'
  static endpoint = '/menu/menus'

  @identifier public id: string

  @property public version: number
  @property public active: boolean
  @property public createTime: number
  @property public updateTime: number

  @property public deviceType: string // "DESKTOP"
  @property public label: string
  @property public icon: string
  @property public color: string
  @property public showType: string // "SIMPLE"
  @property public selected: boolean

  @referenceOne(Menu) public pid: Menu

  @property public condition: string
  @property public weight: number
  @property public dynamicSupportValue: boolean
  @property public type: string // "MENU"
  @property public code: string // "homepage"
  @property public availableRange: Partial<IMenuAvailableRange>
}
