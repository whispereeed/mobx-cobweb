/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:25. *
 ***************************************************/
import { Model, prop } from '../../src'

export default class Power extends Model {
  static type = 'charge.Powers'
  static endpoint = '/charge/powers'

  @prop public powerCode: string
  @prop public powerName: string
  @prop public chargeType: string
  @prop public state: string
  @prop public allowSetAuto: boolean
  @prop public autoAdd: boolean
  @prop public isVisible: boolean

  @prop public chargeInfo: {
    expireTime: number
    sumPeopleCount: number
    usedPeopleCount: number
    startTime: number
  }
  @prop public histories: any[]
}
