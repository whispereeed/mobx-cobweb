/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 10:26. *
 ***************************************************/
import { attribute, Model } from '../../src'
import Me from './Me'

export default class Menu extends Model {
  static type = 'menu.Menus'
  static endpoint = '/menu/menus'

  @attribute({ isIdentifier: true }) public id: string

  @attribute() public label: string
  @attribute() public selected: boolean
  @attribute() public type: string
  @attribute() public code: string

  @attribute({ toOne: Menu }) public pid: Menu
}
