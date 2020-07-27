import { collection, useFixturesByGET } from './config'

import { modelToJSON } from '../src'
import Staff from './models/Staff'
import Me from './models/Me'

describe('collection.findOne', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Staff)
  })

  test('should findOne at collection', async () => {
    const sf = await collection.fetch<Staff>(Staff)

    const staff = collection.findOne<Staff>(Staff, 'cdb28c900c75')
    expect(staff.id).toBe('cdb28c900c75')
    expect(modelToJSON(staff)).toMatchSnapshot()

    const staffx = collection.findOne<Staff>(Staff.type, 'cdb28c900c75')
    expect(staffx.id).toBe('cdb28c900c75')
    expect(staff).toBe(staffx)

    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]

    expect(modelToJSON(staff)).toMatchSnapshot()
    expect(staff === me.staff).toBeTruthy()

    const staff2 = collection.findOne(Staff, 'cdb28c900c75')
    expect(staff === staff2).toBeTruthy()

    const staff3 = (sf.data as Staff[]).find((s) => s.id === staff.id)

    expect(staff === staff3).toBeTruthy()

    expect(staff.id).toBe('cdb28c900c75')
    expect(modelToJSON(staff)).toMatchSnapshot()
  })
})
