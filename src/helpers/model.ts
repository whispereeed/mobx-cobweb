import {
  commitModel,
  getModelCollection,
  getModelId,
  getModelType,
  getRefId,
  IModelRef,
  PureCollection,
  PureModel,
  revertModel,
  updateModelId
} from '../datx'
import { getMeta, mapItems, isArrayLike } from 'datx-utils'
import { action } from 'mobx'

import { clearCacheByType } from './cache'
import { IRawResponse, IRequestOptions, RESPONSE_DATATYPE } from '../interfaces'

import { modelRequest, simpleRequest } from './network'
import { ResponseView } from '../ResponseView'
import { error } from './utils'
import { INetActionsMixinForCollection } from '../interfaces/INetActionsMixin'
import { getModelEndpoint, getModelRefType, modelToRecord, isModelPersisted, setModelPersisted } from './api'

export async function upsertModel<T extends PureModel>(model: T, options: IRequestOptions = {}): Promise<T> {
  const collection = getModelCollection(model) as INetActionsMixinForCollection<PureCollection> & PureCollection
  const modelType = getModelType(model)
  options.data = options.data ?? modelToRecord(model)
  const result = await modelRequest<T>({
    modelType,
    options,
    collection,
    ids: getModelId(model),
    method: 'PUT'
  })
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
    const response = await modelRequest<T>({
      modelType,
      options,
      collection,
      ids: getModelId(model),
      method: 'DELETE'
    })

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
  const endpoint = getModelEndpoint(modelType, collection)
  const rawResponse = await simpleRequest(collection, endpoint, options)
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
