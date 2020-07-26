/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 12:22. *
 ***************************************************/
import { PureModel } from 'datx'
import { getMeta, setMeta } from 'datx-utils'

export const MODEL_PERSISTED_FIELD = 'MODEL_PERSISTED_FIELD'

export function isModelPersisted<T extends PureModel>(model: T) {
  return getMeta(model, MODEL_PERSISTED_FIELD) === true
}

export function setPersisted<T extends PureModel>(model: T, status: boolean) {
  setMeta(model, MODEL_PERSISTED_FIELD, status)
}
