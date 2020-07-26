import { getModelCollection, getModelType, getRefId, IModelRef, IType, modelToJSON, PureModel } from 'datx'
import { getMeta, IRawModel, mapItems, META_FIELD } from 'datx-utils'
import { action } from 'mobx'

import { MODEL_PERSISTED_FIELD, isModelPersisted, setPersisted } from './consts'
import { clearCacheByType } from './cache'
import { IRequestOptions } from '../interfaces'

import { create, remove, update } from './network'
import { ResponseView } from '../ResponseView'
import { Collection } from '../Collection'
import { error } from './utils'

function handleResponse<T extends PureModel>(record: T): (response: ResponseView<T>) => T {
  return action(
    (response: ResponseView<T>): T => {
      if (response.error) {
        throw response.error
      }

      if (response.status === 204) {
        setPersisted(record, true)
        return record
      } else if (response.status === 202) {
        return response.data as T
      } else {
        setPersisted(record, true)
        return response.replace(record).data as T
      }
    }
  )
}

export async function saveModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<T> {
  const collection = getModelCollection(model) as Collection
  const data = modelToJSON(model)
  delete data.__META__

  const request = isModelPersisted(model) ? update : create
  options.data = data
  const modelType = getModelType(model)

  const result = await request<T>(modelType, options, collection)
  const response: T = handleResponse<T>(model)(result)
  clearCacheByType(modelType)
  return response
}

export async function removeModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<void> {
  const collection = getModelCollection(model) as Collection

  if (isModelPersisted(model)) {
    const modelType = getModelType(model)
    const response = await remove(modelType, options, collection)
    if (response.error) {
      throw response.error
    }
    setPersisted(model, false)
  }

  if (collection) {
    await collection.removeOne(model)
  }
}

export function flattenModel(data: any, type: IType): IRawModel {
  if (!data) return null

  return {
    ...data,
    [META_FIELD]: {
      id: data.id,
      [MODEL_PERSISTED_FIELD]: Boolean(data.id),
      refs: {},
      type
    }
  }
}

export function fetchModelRefs<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<Array<ResponseView<any>>> {
  const collection = getModelCollection(model) as Collection
  const { refs } = (model as any).meta!
  const _promises = Object.keys(refs).map((key) => {
    const _refInfo = refs[key]
    if (Array.isArray(_refInfo)) {
      const _ids = _refInfo.map((d) => d.id)
      const _type = _refInfo[0].type
      return collection.fetch<any>(_type, _ids, options)
    }
    return collection.fetch<any>(_refInfo.type, _refInfo.id, options)
  })
  return Promise.all(_promises)
}

export function fetchModelRef<T extends PureModel>(model: T, key: string, options: IRequestOptions = {}): Promise<ResponseView<any>> {
  const collection = getModelCollection(model) as Collection
  const fieldsDef: any = getMeta(model, 'fields', {})
  if (!fieldsDef) {
    throw error(`fetchModelRef.key (${key}) must be a ref definition`)
  }
  const fieldDef = fieldsDef[key]
  const type = fieldDef.referenceDef.model
  const id = mapItems(getRefId(model, key), (ref: IModelRef) => ref.id)
  return collection.fetch(type, id, options)
}
