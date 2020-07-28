/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:53. *
 ***************************************************/
import { IModelConstructor, Model as _Model } from './datx'
import { withNetActions } from './mixins/withNetActions'
import { INetActionsMixin } from './interfaces/INetActionsMixin'

const WithNetActionModel: IModelConstructor<INetActionsMixin<_Model> & _Model> = withNetActions(_Model)

export class Model extends WithNetActionModel {}
