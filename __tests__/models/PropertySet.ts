/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:22. *
 ***************************************************/
import { Model, property } from '../../src'

export default class PropertySet extends Model {
  static type = 'flow.PropertySet'
  static endpoint = '/flow/propertySet'

  @property public name: string
  @property public label: string
  @property public active: boolean
  @property public canAsDimension: boolean
  @property public ability: boolean
  @property public dataType: object
}
