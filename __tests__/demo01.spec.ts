import './network'
import { useFixturesByGET } from './nockConfig'

import { collection } from './collection'
import { modelToJSON } from 'datx'
import Staff from './models/Staff'
import Me from './models/Me'

describe('api', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Staff)
  })

  test('findOne', async () => {
    const sf = await collection.fetch<Staff>(Staff)

    const staff = collection.findOne<Staff>(Staff, 'XRA9koBTaA0000:gongyanyu')
    expect(staff.id).toBe('XRA9koBTaA0000:gongyanyu')
    expect(modelToJSON(staff)).toMatchSnapshot()

    const staffx = collection.findOne<Staff>(Staff.type, 'XRA9koBTaA0000:gongyanyu')
    expect(staffx.id).toBe('XRA9koBTaA0000:gongyanyu')
    expect(staff).toBe(staffx)

    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]

    expect(modelToJSON(staff)).toMatchSnapshot()
    expect(staff === me.staff).toBeTruthy()

    const staff2 = collection.findOne(Staff, 'XRA9koBTaA0000:gongyanyu')
    expect(staff === staff2).toBeTruthy()

    const staff3 = (sf.data as Staff[]).find(s => s.id === staff.id)

    expect(staff === staff3).toBeTruthy()

    expect(staff.id).toBe('XRA9koBTaA0000:gongyanyu')
    expect(modelToJSON(staff)).toMatchSnapshot()
  })
})
