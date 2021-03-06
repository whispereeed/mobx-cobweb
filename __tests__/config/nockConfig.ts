/***************************************************
 * Created by nanyuantingfeng on 2020/3/20 14:54. *
 ***************************************************/
import nock from 'nock'
import path from 'path'
import G from 'glob'

const BASE_HOST = 'http://127.0.0.1:3000/api/v1'

const MAPPER: any = {}
const fixtures = path.join(__dirname, '..', 'fixtures')
const files = G.sync('**/**.json', { nodir: true, cwd: fixtures })

files.forEach((f) => {
  const json = require(path.join(fixtures, f))
  const url = f.replace('.json', '').replace(/\./g, '/')
  MAPPER['/' + url] = json
})

let CURRENT_SCOPE: nock.Scope

export function useFixturesByGET() {
  CURRENT_SCOPE = nock(BASE_HOST)
  Object.keys(MAPPER).forEach((url) => {
    CURRENT_SCOPE.persist().get(url).reply(200, JSON.stringify(MAPPER[url]))
  })
  return CURRENT_SCOPE
}

export function useFixtureLimitByPOST(key: string) {
  CURRENT_SCOPE.persist()
    .post(key)
    .reply(200, (uri: string, body: any) => {
      const { limit } = body
      const { start, count } = limit
      const json = MAPPER[key]
      const items = json.items.slice(start, start + count)
      return JSON.stringify({ items, count: json.count })
    })
}

export function useFixtureGetById(key: string) {
  CURRENT_SCOPE.persist()
    .get(new RegExp(key + '/\\$.+'))
    .reply(200, (uri: string) => {
      const id = uri.slice(uri.lastIndexOf('/$') + 2)
      const json = MAPPER[key]
      const object = json.items.find((k: any) => k.id === id)
      return JSON.stringify({ value: object })
    })
}

export function useFixtureGetByIds(key: string) {
  CURRENT_SCOPE.persist()
    .get(new RegExp(key + '/\\[.+\\]'))
    .reply(200, (uri: string) => {
      const ids = uri.slice(uri.lastIndexOf('/') + 2, -1).split(',')
      const json = MAPPER[key]
      const object = json.items.filter((k: any) => ids.includes(k.id))
      return JSON.stringify({ items: object, count: ids.length })
    })
}

export function useFixtureGet404(key: string) {
  CURRENT_SCOPE.persist()
    .get(new RegExp(key))
    .reply(404, (uri: string) => {
      return JSON.stringify({})
    })
}

export function useFixturePUTById(key: string, code: number = 200, value?: any) {
  CURRENT_SCOPE.persist(false)
    .put(new RegExp(key + '/\\$.+'))
    .reply(code, (uri: string, body) => {
      if (value !== null && value !== undefined) {
        return JSON.stringify(value)
      }

      const id = uri.slice(uri.lastIndexOf('/$') + 2)
      const json = MAPPER[key]
      const object = json.items.find((k: any) => k.id === id)
      return JSON.stringify({
        value: {
          ...object,
          ...(body as {})
        }
      })
    })
}

export function useFixtureDELETEById(key: string, code: number = 200, value: any = { value: true }) {
  CURRENT_SCOPE.persist(false)
    .delete(new RegExp(key + '/\\$.+'))
    .reply(code, (uri: string, body) => {
      return JSON.stringify(value)
    })
}
