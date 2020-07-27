import { collection, useFixturesByGET, useFixtureGetById, useFixtureGetByIds } from './config'

import Staff from './models/Staff'
import Me from './models/Me'
import { getRefId, IIdentifier } from '../src'
import Department from './models/Department'

describe('Modal fetchRefs/fetchRef', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('should be fetched all Models at Model instance', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect((getRefId(me, 'staff') as any).id).toBe('cdb28c900c75')

    useFixtureGetById(Staff.endpoint)
    const response = await collection.fetch<Staff>(Staff, (getRefId(me, 'staff') as any).id as IIdentifier)
    useFixtureGetById(Department.endpoint)
    useFixtureGetByIds(Department.endpoint)
    const response2 = await response.data.fetchRefs()
    expect(response2).toBeInstanceOf(Array)
    expect(me.staff.defaultDepartment).toBeInstanceOf(Department)
    expect(me.staff.defaultDepartment).toBe(collection.findOne(Department, me.staff.defaultDepartment.id))
  })

  test('should be fetched Model by key at Model instance', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    useFixtureGetById(Staff.endpoint)
    const response = await collection.fetch<Staff>(Staff, (getRefId(me, 'staff') as any).id as IIdentifier)
    useFixtureGetById(Department.endpoint)
    useFixtureGetByIds(Department.endpoint)
    const response2 = await response.data.fetchRef('defaultDepartment')
    expect(me.staff.defaultDepartment).toBeInstanceOf(Department)
    expect(response2.data).toBe(me.staff.defaultDepartment)
    expect(me.staff.departments.length).toBe(1)
    expect(me.staff.departments[0]).toBe(response2.data)
  })
})
