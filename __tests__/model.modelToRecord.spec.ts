import { collection, useFixtureGetById, useFixturesByGET } from './config'
import Staff from './models/Staff'
import { getRefId, modelToRecord } from '../src'
import Me from './models/Me'

describe('model.modelToRecord', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureGetById(Staff.endpoint)
    collection.removeAll(Staff)
    collection.removeAll(Me)
  })

  test('should be serialize model to object', async () => {
    const response = await collection.fetch(Staff, 'cdb28c900c75')
    const staff = response.data
    expect(modelToRecord(staff)).toEqual({
      id: 'cdb28c900c75',
      name: 'Principal',
      code: 41738,
      departments: ['66f58b59c384'],
      defaultDepartment: '66f58b59c384'
    })

    expect(modelToRecord(staff, ['id'])).toEqual({
      name: 'Principal',
      code: 41738,
      departments: ['66f58b59c384'],
      defaultDepartment: '66f58b59c384'
    })

    expect(modelToRecord(staff, ['id', 'defaultDepartment'])).toEqual({
      name: 'Principal',
      code: 41738,
      departments: ['66f58b59c384']
    })

    expect(staff.recordOf(['code'])).toEqual({
      id: 'cdb28c900c75',
      name: 'Principal',
      departments: ['66f58b59c384'],
      defaultDepartment: '66f58b59c384'
    })
  })

  test('should be serialize orphan model to object', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect((getRefId(me, 'staff') as any).id).toBe('cdb28c900c75')
    await collection.fetch(Staff, (getRefId(me, 'staff') as any).id)

    expect(me.recordOf()).toEqual({ staff: 'cdb28c900c75' })
  })
})
