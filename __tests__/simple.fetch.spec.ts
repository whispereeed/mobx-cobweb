import './network'

import { useFixtureGetById, useFixturesByGET } from './nockConfig'

import { collection } from './collection'
import { modelToJSON, getRefId } from 'datx'
import { fetchModelRefs, GenericView } from '../src'
import Me from './models/Me'
import Staff from './models/Staff'

describe('simple', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('fetch', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect(getRefId(me, 'staff')).toBe('XRA9koBTaA0000:gongyanyu')

    useFixtureGetById(Staff.endpoint)
    await collection.fetch(Staff, getRefId(me, 'staff'))
    expect(me.staff.id).toEqual('XRA9koBTaA0000:gongyanyu')
    expect(modelToJSON(me)).toMatchSnapshot()
    expect(modelToJSON(me.staff)).toMatchSnapshot()
    const meV = new GenericView(Me, collection, null, [me])
    expect(meV.list[0] === me).toBeTruthy()
  })

  test('fetchModelRefs', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect(getRefId(me, 'staff')).toBe('XRA9koBTaA0000:gongyanyu')

    useFixtureGetById(Staff.endpoint)
    await fetchModelRefs(me)
    expect(me.staff.id).toEqual('XRA9koBTaA0000:gongyanyu')
    expect(modelToJSON(me)).toMatchSnapshot()
    expect(modelToJSON(me.staff)).toMatchSnapshot()
    const meV = new GenericView(Me, collection, null, [me])
    expect(meV.list[0] === me).toBeTruthy()
  })
})
