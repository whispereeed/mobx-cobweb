/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { IModelConstructor, PureModel } from 'datx'
import { withNetActions } from './mixins/withNetActions'
import { INetActionsMixin } from './interfaces/INetActionsMixin'
const WithNetActionModel: IModelConstructor<INetActionsMixin<PureModel> & PureModel> = withNetActions(PureModel)

export class GenericModel extends WithNetActionModel {}
