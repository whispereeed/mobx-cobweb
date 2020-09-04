/***************************************************
 * Created by nanyuantingfeng on 2020/9/4 12:04. *
 ***************************************************/
import { attribute, Model } from '../../src'
import Dir from './Dir'

export default class File extends Model {
  static type = 'demo.File'

  @attribute({ isIdentifier: true }) public id!: string
  @attribute({ toOne: () => Dir }) public dir!: Dir

  @attribute() public name!: string
}
