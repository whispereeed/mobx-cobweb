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
import { TreeDataView } from '../src'

describe('TreeDataView', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureGetById(Department.endpoint)
    useFixtureGetChildrenById(Department.endpoint)
    useFixtureGetParentsById(Department.endpoint)
    collection.removeAll(Department)
  })

  it('should be fetched children nodes', async () => {
    const response = await collection.fetch<Department>(Department, '005ddc160e41')
    const treeDataView = new TreeDataView<Department>(Department, collection)
    const listDataView = await treeDataView.searchChildren(response.data)
    expect(listDataView.data).toBeInstanceOf(Array)
    expect(listDataView.data.length).toBe(5)
    const dept = listDataView.data[0]
    expect(dept).toMatchSnapshot()
    expect(collection.findAll(Department).length).toBe(6)

    await listDataView.next()
    expect(listDataView.data.length).toBe(5)
  })

  it('should be fetched parent nodes on chain', async () => {
    const response = await collection.fetch<Department>(Department, '90bba1c0c670')
    const treeDataView = new TreeDataView<Department>(Department, collection)
    const current = response.data
    const responseView = await treeDataView.searchParents(current)
    expect(responseView.data).toBeInstanceOf(Array)
    expect(responseView.data.length).toBe(7)
    const a = collection.findOne<Department>(Department, current.parentId)
    const b = collection.findOne<Department>(Department, a.parentId)
    const c = collection.findOne<Department>(Department, b.parentId)
    const d = collection.findOne<Department>(Department, c.parentId)
    expect(a).toBeInstanceOf(Department)
    expect(b).toBeInstanceOf(Department)
    expect(b).toMatchSnapshot()
    expect(c).toBeInstanceOf(Department)
    expect(d).toBeInstanceOf(Department)
  })
})
