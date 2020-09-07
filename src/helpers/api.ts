/***************************************************
 * Created by nanyuantingfeng on 2020/9/7 09:52. *
 ***************************************************/
import {
  getModelCollection,
  getModelType,
  IFieldDefinition,
  IModelConstructor,
  IModelRef,
  IType,
  modelToJSON,
  PureCollection,
  PureModel
} from '../datx'
import { error, getValue, isIdentifier } from './utils'
import { getMeta, mapItems, setMeta } from 'datx-utils'
import { MODEL_PERSISTED_FIELD, ORPHAN_MODEL_ID_KEY, ORPHAN_MODEL_ID_VAL } from './consts'
import { isArrayLike } from 'mobx'

export function getModelEndpoint(type: IType, collection: PureCollection): string {
  const QueryModel: any = getModelConstructor(type, collection)

  if (!QueryModel) {
    throw error(`No definition for endpoint was found at Collection<${type}>`)
  }

  const endpoint = getValue<string>(QueryModel.endpoint)

  if (!endpoint) {
    throw error(`No definition for endpoint was found at Model<${type}>`)
  }

  return endpoint
}

export function getModelConstructor<T extends PureModel>(
  model: T | IModelConstructor<T> | IType,
  collection: PureCollection
) {
  const modelType = getModelType(model)
  return (collection.constructor as typeof PureCollection).types.find((Q) => Q.type === modelType)
}

export function isOrphanModel<T extends PureModel>(
  model: IType | T | IModelConstructor<T>,
  collection?: PureCollection
) {
  if (isIdentifier(model)) {
    if (!collection) {
      throw error(`isOrphanModel(T,collection) if T is IType , collection is required!`)
    }
    model = getModelConstructor(model, collection) as IModelConstructor<T>
  }
  return getMeta(model as T, ORPHAN_MODEL_ID_KEY, null, true) === ORPHAN_MODEL_ID_VAL
}

export function getModelRefType(
  model: Function | any,
  data: any,
  parentModel: PureModel,
  key: string,
  collection?: PureCollection
): IType {
  if (typeof model === 'function') {
    collection = collection || getModelCollection(parentModel)
    return getModelType(model(data, parentModel, key, collection))
  }
  return model
}

export function isModelReference(value: IModelRef | Array<IModelRef>): true
export function isModelReference(value: unknown): false
export function isModelReference(value: unknown): boolean {
  if (isArrayLike(value)) {
    return (value as Array<IModelRef>).every(isModelReference)
  }

  return (
    typeof value === 'object' && value !== null && 'type' in value && 'id' in value && Object.keys(value).length === 2
  )
}

export function modelToRecord<T extends PureModel>(model: T, exclude?: string[]) {
  const raw = modelToJSON(model)
  const fields = getMeta<Record<string, IFieldDefinition>>(model, 'fields', {})
  Object.keys(fields).forEach((fieldName) => {
    if (fields[fieldName].referenceDef)
      raw[fieldName] = mapItems(raw[fieldName], (v) => (isModelReference(v) ? v.id : v))
  })
  delete raw.__META__
  exclude?.forEach((key) => delete raw[key])

  const idField = getModelIdField(model)
  if (idField === ORPHAN_MODEL_ID_KEY) {
    delete raw[idField]
  }

  return raw
}

export function getModelIdField<T extends PureModel>(model: T | IModelConstructor<T>): string {
  if (model instanceof PureModel) {
    return getMeta<string>(model, 'id', 'id', true)
  }

  if (typeof model === 'function') {
    return getMeta<string>(model, 'idField', 'id', true)
  }
  return undefined
}

export function isModelPersisted<T extends PureModel>(model: T) {
  return getMeta(model, MODEL_PERSISTED_FIELD) === true
}
export function setModelPersisted<T extends PureModel>(model: T, status: boolean) {
  setMeta(model, MODEL_PERSISTED_FIELD, status)
}
