/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:22. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class PropertySet extends Model {
  static type = 'flow.PropertySet'
  static endpoint = '/flow/propertySet'

  @attribute() public name: string
  @attribute() public label: string
}
