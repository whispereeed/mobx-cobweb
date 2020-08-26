import { collection, useFixtureGet404, useFixturesByGET } from './config'
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
  })
})
