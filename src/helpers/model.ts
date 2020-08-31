import {
  commitModel,
  getModelCollection,
  getModelId,
  getModelType,
  getRefId,
  IModelConstructor,
  IModelRef,
  IType,
  modelToJSON,
  PureCollection,
  PureModel,
  revertModel,
  updateModelId,
  IFieldDefinition
} from '../datx'
import { getMeta, mapItems } from 'datx-utils'
import { action, isArrayLike } from 'mobx'

import { isModelPersisted, ORPHAN_MODEL_ID_KEY, ORPHAN_MODEL_ID_VAL, setModelPersisted } from './consts'
import { clearCacheByType } from './cache'
import { IRawResponse, IRequestOptions, RESPONSE_DATATYPE } from '../interfaces'

import { getModelEndpointURL, remove, request, upsert } from './network'
import { ResponseView } from '../ResponseView'
import { error, isIdentifier } from './utils'
import { INetActionsMixinForCollection } from '../interfaces/INetActionsMixin'

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

export async function upsertModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<T> {
  const collection = getModelCollection(model) as INetActionsMixinForCollection<PureCollection> & PureCollection
  const modelType = getModelType(model)
  options.data = options.data ?? modelToRecord(model)
  const result = await upsert<T>(modelType, options, collection, getModelId(model))
  const response: T = action(
    (response: ResponseView<T>): T => {
      if (response.error) {
        if (!options.skipRevert) {
          revertModel(model)
        }
        throw response
      }

      if (response.status === 204) {
        commitModel(model)
        setModelPersisted(model, true)
        return model
      }

      if (response.status === 202) {
        const modelO = response.replace(model).data as T
        commitModel(modelO)
        return modelO
      }

      if (response.dataType === RESPONSE_DATATYPE.SINGLE_STATUS) {
        if (response.meta.value === true) {
          commitModel(model)
        } else {
          if (!options.skipRevert) {
            revertModel(model)
          }
        }

        setModelPersisted(model, true)
        return model
      }

      if (response.dataType === RESPONSE_DATATYPE.CREATION) {
        updateModelId(model, response.meta.id)
        commitModel(model)
        setModelPersisted(model, true)
        return model
      }

      if (response.dataType === RESPONSE_DATATYPE.SINGLE_DATA) {
        const modelO = response.data as T
        commitModel(modelO)
        return modelO
      }

      throw response
    }
  )(result)

  clearCacheByType(modelType)
  return response
}

export async function removeModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<boolean> {
  const collection = getModelCollection(model) as INetActionsMixinForCollection<PureCollection> & PureCollection

  if (isModelPersisted(model)) {
    const modelType = getModelType(model)
    const response = await remove(modelType, options, collection, getModelId(model))
    if (response.error) {
      throw response
    }

    if (response.dataType === RESPONSE_DATATYPE.SINGLE_STATUS) {
      if (response.meta.value === false) {
        return false
      }
    }

    setModelPersisted(model, false)
  }

  if (collection) {
    await collection.removeOne(model)
  }

  return true
}

export async function requestOnModel<T extends PureModel>(model: T, options: IRequestOptions): Promise<IRawResponse> {
  const collection = getModelCollection(model) as INetActionsMixinForCollection<PureCollection> & PureCollection
  const modelType = getModelType(model)
  const endpoint = getModelEndpointURL(modelType, collection)
  const rawResponse = await request(collection, endpoint, options)
  rawResponse.modelType = modelType
  rawResponse.collection = collection
  return rawResponse
}

export function fetchModelRef<T extends PureModel>(
  model: T,
  key: string,
  options: IRequestOptions = {}
): Promise<ResponseView<any>> {
  const collection = getModelCollection(model) as INetActionsMixinForCollection<PureCollection> & PureCollection
  const fieldsDef: any = getMeta(model, 'fields', {})
  if (!fieldsDef) {
    throw error(`fetchModelRef.key (${key}) must be a ref definition`)
  }
  const fieldDef = fieldsDef[key]
  const type = getModelRefType(fieldDef.referenceDef.model, fieldDef.referenceDef.defaultValue, model, key)
  const id = mapItems(getRefId(model, key), (ref: IModelRef) => ref.id)
  return collection.fetch(type, id, options)
}

export function fetchModelRefs<T extends PureModel>(
  model: T,
  options: IRequestOptions = {}
): Promise<Array<ResponseView<any>>> {
  const collection = getModelCollection(model) as INetActionsMixinForCollection<PureCollection> & PureCollection
  const { refs } = (model as any).meta!
  const promises = Object.keys(refs).map((key) => {
    const refDef = refs[key]
    if (isArrayLike(refDef)) {
      const _ids = refDef.map((d) => d.id)
      const _type = refDef[0].type
      return collection.fetch<any>(_type, _ids, options)
    }
    return collection.fetch<any>(refDef.type, refDef.id, options)
  })
  return Promise.all(promises)
}
