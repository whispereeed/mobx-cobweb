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
    const b = await staff.remove()
    expect(b).toBeFalsy()

    const data0 = collection.findOne(Staff, 'cdb28c900c75')
    expect(data0).toBe(staff)

    useFixtureDELETEById(Staff.endpoint)
    await staff.remove()
    const data1 = collection.findOne(Staff, 'cdb28c900c75')
    expect(data1).toBeNull()
  })

  test('should be keep local collection model', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    const fn = jest.fn()
    useFixtureDELETEById(Staff.endpoint, 200, { errorCode: 403, errorMessage: 'xxx' })
    await staff.remove().catch((e) => {
      fn()
      expect(e.error).toEqual({ errorCode: 403, errorMessage: 'xxx' })
    })
    expect(fn).toBeCalledTimes(1)
    const data2 = collection.findOne(Staff, 'cdb28c900c75')
    expect(data2).not.toBeNull()
    expect(data2).toBe(staff)
  })
})
