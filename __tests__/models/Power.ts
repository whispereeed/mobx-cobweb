/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:25. *
 ***************************************************/
import { identifier, Model, property } from '../../src'

export default class Power extends Model {
  static type = 'charge.Powers'
  static endpoint = '/charge/powers'

  @identifier public powerCode: string
  @property public powerName: string
  @property public chargeType: string
  @property public state: string
  @property public allowSetAuto: boolean
  @property public autoAdd: boolean
  @property public isVisible: boolean

  @property public chargeInfo: {
    expireTime: number
    sumPeopleCount: number
    usedPeopleCount: number
    startTime: number
  }
  @property public histories: any[]
}
