/***************************************************
 * Created by nanyuantingfeng on 2020/6/2 16:42. *
 ***************************************************/
import { collection, useFixturesByGET } from './config'
import { TreeDataView } from '../src'
import TreeDataDEMOModel from './models/TreeDataDEMOModel'

describe('TreeDataView', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
  })

  it('should be basic apis', async () => {
    scope.get(TreeDataDEMOModel.endpoint + '/roots').reply(200, (uri: string) => {
      return JSON.stringify({
        items: [
          {
            id: 0,
            name: '0'
          }
        ]
      })
    })

    const treeDataView = new TreeDataView<TreeDataDEMOModel>(TreeDataDEMOModel, collection)
    await treeDataView.searchRoots()
    expect(treeDataView.data.length).toBe(1)
    const root = treeDataView.data[0]
    expect(collection.findAll(TreeDataDEMOModel).length).toBe(1)

    scope
      .persist()
      .post(TreeDataDEMOModel.endpoint + '/$0/children')
      .reply(200, (uri: string, body: any) => {
        const { limit } = body
        const { start, count } = limit
        const oo = []
        let i = -1
        while (++i < count) {
          oo.push({ id: start + i, name: start + i })
        }
        return JSON.stringify({ items: oo, count: 100 })
      })

    await treeDataView.infinite(root, { selector: { limit: [0, 30] } })
    const childrenList = treeDataView.getInfiniteListDataView(root)
    expect(treeDataView.data.length).toBe(1)
    expect(root.children.length).toBe(30)
    await childrenList.next()
    expect(root.children.length).toBe(60)
    expect(collection.findAll(TreeDataDEMOModel).length).toBe(60)

    scope
      .persist()
      .get(TreeDataDEMOModel.endpoint + '/$20/parents')
      .reply(200, (uri: string) => {
        return JSON.stringify({ items: [{ id: 200 }, { id: 10 }, { id: 0 }] })
      })

    const resp = await treeDataView.searchParents(20)

    expect(resp.data.length).toBe(3)
  })
})
