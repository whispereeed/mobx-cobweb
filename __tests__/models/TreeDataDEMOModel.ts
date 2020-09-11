/***************************************************
 * Created by nanyuantingfeng on 2020/9/11 15:52. *
 ***************************************************/
import { attribute, Model } from '../../src'

export default class TreeDataDEMOModel extends Model {
  static type = 'organization.Tree'
  static endpoint = '/organization/demo'

  @attribute({ isIdentifier: true }) public id: string
  @attribute({ toOne: TreeDataDEMOModel, parse: (v, d: any) => d.parentId }) public parent: TreeDataDEMOModel
  @attribute() public parentId: string
  @attribute() public name: string
  @attribute({ toMany: TreeDataDEMOModel }) public children: TreeDataDEMOModel[]
}
