import { collection, useFixtureGetById, useFixtureDELETEById, useFixturesByGET } from './config'
import Staff from './models/Staff'

describe('model.remove', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureGetById(Staff.endpoint)
    collection.removeAll(Staff)
  })

  test('should be remove local collection model', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    expect(staff.name).toBe('Principal')

    useFixtureDELETEById(Staff.endpoint, 200, { value: false })
    await staff.remove()
    const data0 = collection.findOne(Staff, 'cdb28c900c75')
    expect(data0).toBe(staff)

    useFixtureDELETEById(Staff.endpoint)
    await staff.remove()
    const data1 = collection.findOne(Staff, 'cdb28c900c75')
    expect(data1).toBeNull()
  })
})
