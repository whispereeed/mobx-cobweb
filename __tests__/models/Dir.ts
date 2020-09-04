/***************************************************
 * Created by nanyuantingfeng on 2020/9/4 12:04. *
 ***************************************************/
import { attribute, Model } from '../../src'
import File from './File'

export default class Dir extends Model {
  static type = 'demo.Dir'
  @attribute({ isIdentifier: true }) id: number
  @attribute() public name: string
  @attribute({ toMany: File, referenceProperty: 'dir' }) files: File[]
}
