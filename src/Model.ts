/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 12:53. *
 ***************************************************/
import { Model as _Model } from './datx'
import { withStorage } from './mixins/withStorage'
import { withNetActions } from './mixins/withNetActions'

/**** For DTS File (Don`t remove it) ****/
import { INetActionsMixinForModel } from './interfaces/INetActionsMixin'
import { IModelConstructor } from './datx'

export class Model extends withStorage(withNetActions(_Model)) {}
