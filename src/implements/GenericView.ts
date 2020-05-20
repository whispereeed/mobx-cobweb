/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { View } from 'datx'

import { decorateView } from './decorateView'

export const DecoratedView = decorateView(View)

export class GenericView extends DecoratedView {}
