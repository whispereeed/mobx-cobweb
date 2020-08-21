import { collection, useFixtureGetById, useFixturesByGET } from './config'
import Me from './models/Me'
import Staff from './models/Staff'
import { getRefId } from '../src'

describe('collection.ffetch', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('should be fetched a Model By Id/Ids', async () => {
    const data = collection.ffetch<Me, Me>(Me)
    expect(data.current).toBeNull()
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(data.current).toBeInstanceOf(Me)
    expect(data.current.staff).toBeNull()
    expect((getRefId(data.current, 'staff') as any).id).toBe('cdb28c900c75')
    useFixtureGetById(Staff.endpoint)
    await data.current.fetchRefs()
    expect(data.current.staff).toBeInstanceOf(Staff)
    data.refresh()
    expect(data.current.staff).toBeInstanceOf(Staff)
    expect(data.current.staff.name).toBe('Principal')
  })
})
