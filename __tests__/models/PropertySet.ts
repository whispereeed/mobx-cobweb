/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:22. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class PropertySet extends Model {
  static type = 'flow.PropertySet'
  static endpoint = '/flow/propertySet'

  @attribute({ isIdentifier: true }) public name: string
  @attribute() public label: string
  @attribute() public active: boolean
  @attribute() public canAsDimension: boolean
  @attribute() public ability: boolean
  @attribute() public dataType: object
}
