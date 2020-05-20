/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { PureModel } from 'datx'

import { decorateModel } from './decorateModel'

export const DecoratedModel = decorateModel(PureModel)

export class GenericModel extends DecoratedModel {}
