import { collection, useFixtureGetById, useFixturesByGET } from './config'
import Me from './models/Me'
import Staff from './models/Staff'
import { getRefId } from '../src'
import { reaction } from 'mobx'

describe('collection.ffetch', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureGetById(Staff.endpoint)
    collection.removeAll(Me)
    collection.removeAll(Staff)
  })

  test('should be fetched a Model By Id/Ids', async () => {
    const response = collection.ffetch<Me, Me>(Me)
    const fn = jest.fn()
    reaction(() => response.current, fn, { fireImmediately: true })
    expect(fn).toBeCalledTimes(1)
    expect(response.current).toBeNull()
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(response.current).toBeInstanceOf(Me)
    expect(response.current.staff).toBeNull()
    expect((getRefId(response.current, 'staff') as any).id).toBe('cdb28c900c75')

    await response.current.fetchRefs()
    expect(response.current.staff).toBeInstanceOf(Staff)
    response.refresh()
    expect(fn).toBeCalledTimes(2)
    expect(response.current.staff).toBeInstanceOf(Staff)
    expect(response.current.staff.name).toBe('Principal')
  })
})
