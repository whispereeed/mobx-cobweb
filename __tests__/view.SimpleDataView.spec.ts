import { collection, useFixturesByGET, useFixtureGetById, useFixtureGetByIds } from './config'
import { SimpleDataView } from '../src'

import Staff from './models/Staff'
import Me from './models/Me'
import { getRefId } from 'datx'
import Department from './models/Department'

describe('SimpleDataView', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('should be fetch Model by at Model instance', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect(getRefId(me, 'staff')).toBe('XRA9koBTaA0000:gongyanyu')

    useFixtureGetById(Staff.endpoint)
    const response = await collection.fetch<Staff>(Staff, getRefId(me, 'staff'))
    const simpleDataView = new SimpleDataView(response)
    useFixtureGetById(Department.endpoint)
    useFixtureGetByIds(Department.endpoint)
    await simpleDataView.fetchRefs()

    expect(me.staff.defaultDepartment).toBeInstanceOf(Department)
    expect(me.staff.defaultDepartment).toBe(collection.findOne(Department, me.staff.defaultDepartment.id))
  })
})
