import { collection, useFixtureGetById, useFixturePUTById, useFixturesByGET } from './config'
import Staff from './models/Staff'
import { ResponseView } from '../src'
import { isAttributeDirty } from '../src/datx'

describe('model.upsert', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureGetById(Staff.endpoint)
    collection.removeAll(Staff)
  })

  test('should be revert local collection model', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    expect(staff.name).toBe('Principal')
    staff.name = '99999'
    try {
      await staff.upsert()
    } catch (e) {
      expect(e).toBeInstanceOf(ResponseView)
    }
    expect(staff.name).toBe('Principal')
  })

  test('should be commit local collection model', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    expect(staff.name).toBe('Principal')
    staff.name = '99999'
    useFixturePUTById(Staff.endpoint)
    await staff.upsert()
    expect(staff.name).toBe('99999')

    staff.name = '8888'
    useFixturePUTById(Staff.endpoint, 202)
    await staff.upsert()
    expect(staff.name).toBe('8888')

    staff.name = '7777'
    useFixturePUTById(Staff.endpoint, 204, {})
    await staff.upsert()
    expect(staff.name).toBe('7777')
  })

  test('should be commit local collection model use (boolean value)', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    expect(staff.name).toBe('Principal')
    staff.name = '99999'
    useFixturePUTById(Staff.endpoint, 230, { value: true })
    await staff.upsert()
    expect(staff.name).toBe('99999')

    staff.name = '888888'
    useFixturePUTById(Staff.endpoint, 200, { value: false })
    await staff.upsert()
    expect(staff.name).toBe('99999')
  })

  test('should be not revert local collection model use (skipRevert)', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    expect(staff.name).toBe('Principal')
    staff.name = '888888'
    useFixturePUTById(Staff.endpoint, 200, { value: false })
    await staff.upsert({ skipRevert: true })
    expect(staff.name).toBe('888888')
    expect(isAttributeDirty(staff, 'name')).toBeTruthy()
  })
})
