/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { PureModel } from 'datx'
import { withNetActions } from './mixins/withNetActions'

export class GenericModel extends withNetActions(PureModel) {}
