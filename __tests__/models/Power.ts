/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:25. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class Power extends Model {
  static type = 'charge.Powers'
  static endpoint = '/charge/powers'

  @attribute({ isIdentifier: true }) public powerCode: string
  @attribute() public powerName: string
  @attribute() public state: string
}
