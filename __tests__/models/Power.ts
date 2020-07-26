/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:25. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class Power extends Model {
  static type = 'charge.Powers'
  static endpoint = '/charge/powers'

  @attribute({ isIdentifier: true }) public powerCode: string
  @attribute() public powerName: string
  @attribute() public chargeType: string
  @attribute() public state: string
  @attribute() public allowSetAuto: boolean
  @attribute() public autoAdd: boolean
  @attribute() public isVisible: boolean

  @attribute() public chargeInfo: {
    expireTime: number
    sumPeopleCount: number
    usedPeopleCount: number
    startTime: number
  }
  @attribute() public histories: any[]
}
