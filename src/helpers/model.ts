import { getModelCollection, getModelMetaKey, getModelType, getRefId, IIdentifier, IType, modelToJSON, PureModel, setModelMetaKey } from 'datx'

import { IRawModel, META_FIELD } from 'datx-utils'

import { clearCacheByType } from './cache'
import { MODEL_PERSISTED_FIELD, MODEL_PROP_FIELD, MODEL_QUEUE_FIELD, MODEL_RELATED_FIELD } from './consts'

import { IRequestOptions } from '../interfaces'

import { create, remove, update } from './NetworkUtils'
import { action } from 'mobx'
import { ResponseView } from '../ResponseView'
import { Collection } from '../Collection'

function isModelPersisted(model: PureModel): boolean {
  return getModelMetaKey(model, MODEL_PERSISTED_FIELD)
}

function setModelPersisted(model: PureModel, status: boolean) {
  setModelMetaKey(model, MODEL_PERSISTED_FIELD, status)
}

function handleResponse<T extends PureModel>(record: T, prop?: string): (response: ResponseView<T>) => T {
  return action(
    (response: ResponseView<T>): T => {
      if (response.error) {
        throw response.error
      }

      if (response.status === 204) {
        setModelMetaKey(record, MODEL_PERSISTED_FIELD, true)
        return record
      } else if (response.status === 202) {
        const responseRecord = response.data as T
        setModelMetaKey(responseRecord, MODEL_PROP_FIELD, prop)
        setModelMetaKey(responseRecord, MODEL_QUEUE_FIELD, true)
        setModelMetaKey(responseRecord, MODEL_RELATED_FIELD, record)
        return responseRecord
      } else {
        setModelMetaKey(record, MODEL_PERSISTED_FIELD, true)
        return response.replace(record).data as T
      }
    }
  )
}

export async function saveModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<T> {
  const collection = getModelCollection(model) as Collection
  const data = modelToJSON(model)
  const request = isModelPersisted(model) ? update : create
  options.data = data

  const result = await request<T>(collection, options)
  const response: T = handleResponse<T>(model)(result)
  clearCacheByType(getModelType(model))
  return response
}

export async function removeModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<void> {
  const collection = getModelCollection(model) as Collection

  const isPersisted = isModelPersisted(model)

  if (isPersisted) {
    let response = await remove(collection, options)
    if (response.error) {
      throw response.error
    }
    setModelPersisted(model, false)
  }

  if (collection) {
    await collection.removeOne(model)
  }
}

export function flattenModel(data: any, type: IType): IRawModel | null {
  if (!data) return null

  return {
    ...data,
    [META_FIELD]: {
      id: data.id,
      [MODEL_PERSISTED_FIELD]: Boolean(data.id),
      refs: {},
      type: type
    }
  }
}

export function fetchModelRefs<T extends PureModel>(model: T) {
  const collection = getModelCollection(model) as Collection
  const refs = getModelMetaKey(model, 'refs')
  const map = Object.keys(refs).map((ref) => collection.fetch(refs[ref].model, getRefId(model, ref) as IIdentifier[]))
  return Promise.all(map)
}
