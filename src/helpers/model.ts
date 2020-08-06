import {
  getModelCollection,
  getModelType,
  getRefId,
  IModelRef,
  IType,
  PureCollection,
  PureModel,
  modelToJSON
} from '../datx'
import { getMeta, mapItems } from 'datx-utils'
import { action, isArrayLike } from 'mobx'

import { isModelPersisted, ORPHAN_MODEL_ID_KEY, setModelPersisted } from './consts'
import { clearCacheByType } from './cache'
import { IRequestOptions, IRawResponse } from '../interfaces'

import { remove, upsert, getModelEndpointURL, request } from './network'
import { ResponseView } from '../ResponseView'
import { error } from './utils'
import { INetPatchesMixin } from '../interfaces/INetPatchesMixin'

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

export function getModelIdField<T extends PureModel>(modal: T): string {
  return getMeta<string>(modal, 'idField', 'id', true)
}

export async function upsertModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<T> {
  const collection = getModelCollection(model) as INetPatchesMixin<PureCollection> & PureCollection
  const modelType = getModelType(model)
  if (!options.data) {
    const data = modelToJSON(model)
    delete data.__META__
    const idField = getModelIdField(model)

    if (!isModelPersisted(model) || idField === ORPHAN_MODEL_ID_KEY) {
      delete data[idField]
    }

    options.data = data
  }
  const result = await upsert<T>(modelType, options, collection)
  const response: T = action(
    (response: ResponseView<T>): T => {
      if (response.error) {
        throw response.error
      }
      if (response.status === 204) {
        setModelPersisted(model, true)
        return model
      } else if (response.status === 202) {
        return response.data as T
      } else {
        setModelPersisted(model, true)
        return response.replace(model).data as T
      }
    }
  )(result)

  clearCacheByType(modelType)
  return response
}

export async function removeModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<void> {
  const collection = getModelCollection(model) as INetPatchesMixin<PureCollection> & PureCollection

  if (isModelPersisted(model)) {
    const modelType = getModelType(model)
    const response = await remove(modelType, options, collection)
    if (response.error) {
      throw response.error
    }
    setModelPersisted(model, false)
  }

  if (collection) {
    await collection.removeOne(model)
  }
}

export async function requestOnModel<T extends PureModel, D>(
  model: T,
  options: IRequestOptions
): Promise<IRawResponse<D>> {
  const collection = getModelCollection(model) as INetPatchesMixin<PureCollection> & PureCollection
  const modelType = getModelType(model)
  const endpoint = getModelEndpointURL(modelType, collection)
  return request<D>(collection, endpoint, options)
}

export function fetchModelRef<T extends PureModel>(
  model: T,
  key: string,
  options: IRequestOptions = {}
): Promise<ResponseView<any>> {
  const collection = getModelCollection(model) as INetPatchesMixin<PureCollection> & PureCollection
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
  const collection = getModelCollection(model) as INetPatchesMixin<PureCollection> & PureCollection
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
