import { collection, useFixtureGetById, useFixturesByGET } from './config'
import { modelToJSON, getRefId, IIdentifier } from 'datx'
import { fetchModelRefs, View } from '../src'
import Me from './models/Me'
import Staff from './models/Staff'

describe('collection.fetch', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('should be fetch a Model By Id/Ids', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect(getRefId(me, 'staff')).toBe('XRA9koBTaA0000:gongyanyu')

    useFixtureGetById(Staff.endpoint)
    await collection.fetch(Staff, getRefId(me, 'staff') as IIdentifier)
    expect(me.staff.id).toEqual('XRA9koBTaA0000:gongyanyu')
    expect(modelToJSON(me)).toMatchSnapshot()
    expect(modelToJSON(me.staff)).toMatchSnapshot()
    const meV = new View(Me, collection, null, [me])
    expect(meV.list[0] === me).toBeTruthy()
  })

  test('should be fetch all Refs Models <fetchModelRefs>', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect(getRefId(me, 'staff')).toBe('XRA9koBTaA0000:gongyanyu')

    useFixtureGetById(Staff.endpoint)
    await fetchModelRefs(me)
    expect(me.staff.id).toEqual('XRA9koBTaA0000:gongyanyu')
    expect(modelToJSON(me)).toMatchSnapshot()
    expect(modelToJSON(me.staff)).toMatchSnapshot()
    const meV = new View(Me, collection, null, [me])
    expect(meV.list[0] === me).toBeTruthy()
  })
})
