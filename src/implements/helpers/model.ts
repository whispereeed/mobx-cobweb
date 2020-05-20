import {
  getModelCollection,
  getModelMetaKey,
  getModelType,
  getRefId,
  IType,
  modelToJSON,
  PureModel,
  setModelMetaKey
} from 'datx'

import { IRawModel, META_FIELD } from 'datx-utils'

import { clearCacheByType } from '../cache'
import { MODEL_PERSISTED_FIELD, MODEL_PROP_FIELD, MODEL_QUEUE_FIELD, MODEL_RELATED_FIELD } from '../consts'

import { ISkeletonModel, IRequestOptions, ISkeletonCollection, IResponseView } from '../../interfaces'

import { create, remove, update } from '../NetworkUtils'
import { action } from 'mobx'

function isModelPersisted(model: PureModel): boolean {
  return getModelMetaKey(model, MODEL_PERSISTED_FIELD)
}

function setModelPersisted(model: PureModel, status: boolean) {
  setModelMetaKey(model, MODEL_PERSISTED_FIELD, status)
}

export function saveModel<T extends ISkeletonModel>(model: T, options: IRequestOptions = {}): Promise<ISkeletonModel> {
  const collection = getModelCollection(model) as ISkeletonCollection
  const data = modelToJSON(model)
  const requestMethod = isModelPersisted(model) ? update : create
  options.data = data

  return requestMethod(collection, options)
    .then(handleResponse(model))
    .then(response => {
      clearCacheByType(getModelType(model))
      return response
    })
}

export function removeModel<T extends ISkeletonModel>(model: T, options: IRequestOptions = {}): Promise<void> {
  const collection = getModelCollection(model) as ISkeletonCollection

  const isPersisted = isModelPersisted(model)

  if (isPersisted) {
    return remove(collection, options).then(response => {
      if (response.error) {
        throw response.error
      }

      setModelPersisted(model, false)

      if (collection) {
        collection.removeOne(model)
      }
    })
  } else if (collection) {
    collection.removeOne(model)
  }

  return Promise.resolve()
}

export function flattenModel(data: any, type: IType): IRawModel | null {
  if (!data) {
    return null
  }

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

export function handleResponse<T extends ISkeletonModel>(record: T, prop?: string): (response: IResponseView<T>) => T {
  return action(
    (response: IResponseView<T>): T => {
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
        return response.replaceData(record).data as T
      }
    }
  )
}

export function fetchModelRefs(model: PureModel): Promise<PureModel[]> {
  const collection = getModelCollection(model) as ISkeletonCollection
  const refs = getModelMetaKey(model, 'refs')
  const map = Object.keys(refs).map(ref => collection.fetch(refs[ref].model, getRefId(model, ref)))
  return Promise.all(map).then(d => d.map(k => k.data))
}
