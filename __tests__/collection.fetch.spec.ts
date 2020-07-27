import { collection, useFixtureGetById, useFixturesByGET } from './config'
import { fetchModelRefs, View, modelToJSON, getRefId } from '../src'
import Me from './models/Me'
import Staff from './models/Staff'

describe('collection.fetch', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('should be fetched a Model By Id/Ids', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect((getRefId(me, 'staff') as any).id).toBe('cdb28c900c75')

    useFixtureGetById(Staff.endpoint)
    await collection.fetch(Staff, (getRefId(me, 'staff') as any).id)
    expect(me.staff.id).toEqual('cdb28c900c75')
    expect(modelToJSON(me)).toMatchSnapshot()
    expect(modelToJSON(me.staff)).toMatchSnapshot()
    const meV = new View(Me, collection, null, [me])
    expect(meV.list[0] === me).toBeTruthy()
  })

  test('should be fetched all Refs Models fetchModelRefs', async () => {
    await collection.fetch(Me)
    const me = collection.findAll<Me>(Me)[0]
    expect(me.staff).toBeNull()
    expect((getRefId(me, 'staff') as any).id).toBe('cdb28c900c75')

    useFixtureGetById(Staff.endpoint)
    await fetchModelRefs(me)
    expect(me.staff.id).toEqual('cdb28c900c75')
    expect(modelToJSON(me)).toMatchSnapshot()
    expect(modelToJSON(me.staff)).toMatchSnapshot()
    const meV = new View(Me, collection, null, [me])
    expect(meV.list[0] === me).toBeTruthy()
  })
})
