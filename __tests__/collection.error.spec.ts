import { collection, useFixtureGet404, useFixturesByGET, useFixtureDELETEById } from './config'
import User from './models/User'

describe('collection.error', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureGet404(User.endpoint)
    collection.removeAll(User)
  })

  test('should be fetched a Model By Id/Ids', async () => {
    const data = await collection.fetch<User>(User)
    expect(data.status).toBe(404)
    expect(data.error).not.toBeNull()
  })

  test('should be return error at response', async () => {
    useFixtureDELETEById(User.endpoint, 200, { errorCode: 500, errorMessage: 'xadasdja' })
    const data = await collection.request(User.endpoint + '/$123', { method: 'DELETE' })
    expect(data.status).toBe(200)
    expect(data.data).toBeNull()
    expect(data.error).toEqual({ errorCode: 500, errorMessage: 'xadasdja' })
  })
})
