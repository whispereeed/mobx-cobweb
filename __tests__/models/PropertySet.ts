/***************************************************
 * Created by nanyuantingfeng on 2019/12/4 11:22. *
 ***************************************************/
import { Model, prop } from '../../src'

export default class PropertySet extends Model {
  static type = 'flow.PropertySet'
  static endpoint = '/flow/propertySet'

  @prop public name: string
  @prop public label: string
  @prop public active: boolean
  @prop public canAsDimension: boolean
  @prop public ability: boolean
  @prop public dataType: object
}
