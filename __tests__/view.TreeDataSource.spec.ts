/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 16:42. *
 ***************************************************/
import {
  collection,
  useFixtureGetById,
  useFixtureGetChildrenById,
  useFixtureGetParentsById,
  useFixturesByGET
} from './config'
import Department from './models/Department'
import { TreeDataSource } from '../src'

describe('TreeDataSource', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Department)
  })

  it('should be fetched children nodes', async () => {
    useFixtureGetById(Department.endpoint)
    const response = await collection.fetch<Department>(Department, '005ddc160e41')
    const treeDataView = new TreeDataSource<Department>(Department, collection)
    useFixtureGetChildrenById(Department.endpoint)
    const listDataView = await treeDataView.searchChildren(response.data)
    expect(listDataView.data).toBeInstanceOf(Array)
    expect(listDataView.data.length).toBe(5)
    const dept = listDataView.data[0]
    expect(dept).toMatchSnapshot()
    expect(collection.findAll(Department).length).toBe(6)

    await listDataView.next()
    expect(listDataView.data.length).toBe(0)
  })

  it('should be fetched parent nodes on chain', async () => {
    useFixtureGetById(Department.endpoint)
    const response = await collection.fetch<Department>(Department, '91526189bc96')
    const treeDataView = new TreeDataSource<Department>(Department, collection)
    useFixtureGetParentsById(Department.endpoint)
    const current = response.data
    const responseView = await treeDataView.searchChildren(current)
    expect(responseView.data).toBeInstanceOf(Array)
    expect(responseView.data.length).toBe(4)
    const root = collection.findOne<Department>(Department, '66f58b59c384')
    expect(root).toBeInstanceOf(Department)
    const a = collection.findOne<Department>(Department, current.parentId)
    const b = collection.findOne<Department>(Department, a.parentId)
    const c = collection.findOne<Department>(Department, b.parentId)
    const d = collection.findOne<Department>(Department, c.parentId)
    expect(a).toBeInstanceOf(Department)
    expect(b).toBeInstanceOf(Department)
    expect(b).toMatchSnapshot()
    expect(c).toBeInstanceOf(Department)
    expect(d).toBeInstanceOf(Department)
    expect(d).toBe(root)
  })
})
