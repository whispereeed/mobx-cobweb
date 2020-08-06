/***************************************************
 * Created by nanyuantingfeng on 2020/8/6 19:14. *
 ***************************************************/
import { ICollectionConstructor, IModelConstructor, isCollection, isModel, PureCollection, PureModel } from '../datx'
import { INetActionsMixinForCollection, INetActionsMixinForModel } from '../interfaces/INetActionsMixin'
import { error } from '../helpers/utils'
import { withNetActionsForCollection } from './withNetActionsForCollection'
import { withNetActionsForModel } from './withNetActionsForModel'

export function withNetActions<T extends PureCollection>(
  Base: ICollectionConstructor<T>
): ICollectionConstructor<INetActionsMixinForCollection<T> & T> & {
  cache: boolean
}

export function withNetActions<T extends PureModel>(
  Base: IModelConstructor<T>
): IModelConstructor<INetActionsMixinForModel<T> & T> & {
  endpoint: string | (() => string)
}

export function withNetActions(Base: any) {
  if (isCollection(Base)) {
    return withNetActionsForCollection(Base as typeof PureCollection)
  }

  if (isModel(Base)) {
    return withNetActionsForModel(Base as typeof PureModel)
  }

  throw error(`withNetActions is a mixin for Collection or Model.`)
}
