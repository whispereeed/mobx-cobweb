/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:53. *
 ***************************************************/
import { withNetActions } from './mixins/withNetActions'
import { Model as _Model } from './datx'
import { withStorage } from './mixins/withStorage'

import { IModelConstructor } from './datx'
import { INetActionsMixin } from './interfaces/INetActionsMixin'

export class Model extends withStorage(withNetActions(_Model)) {}
