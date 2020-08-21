import { collection, useFixtureLimitByPOST, useFixturesByGET } from './config'
import { ListDataView } from '../src'
import { autorun } from 'mobx'
import PropertySet from './models/PropertySet'

describe('ListDataView', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureLimitByPOST(PropertySet.endpoint)
    collection.removeAll(PropertySet)
  })

  test('should be fetched data by `page`', async () => {
    useFixtureLimitByPOST(PropertySet.endpoint)
    const listDataView = new ListDataView<PropertySet>(PropertySet, collection)
    const jestFn = jest.fn(() => listDataView.isLoading)
    autorun(jestFn)

    await listDataView.search({
      selector: {
        limit: [0, 10]
      }
    })

    expect(listDataView.data).toBeInstanceOf(Array)
    expect(listDataView.data.length).toBe(10)

    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data[1]).toBeInstanceOf(PropertySet)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('Solutions')

    await listDataView.next()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('Solutions')
    expect(jestFn).toBeCalledTimes(3)

    await listDataView.last()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('Solutions')
    expect(listDataView.data[8].name).toBe('engage')
    expect(jestFn).toBeCalledTimes(5)

    await listDataView.prev()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('Solutions')
    expect(listDataView.data[8].name).toBe('engage')
    expect(listDataView.data[9].name).toBe('Dynamic')
    expect(jestFn).toBeCalledTimes(5)

    await listDataView.first()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[0].name).toBe('Accounts')
    expect(listDataView.data[1].name).toBe('Solutions')
    expect(jestFn).toBeCalledTimes(7)
  })

  test('should be fetched data by `infinite`', async () => {
    const listDataView = new ListDataView<PropertySet>(PropertySet, collection)
    const jestFn = jest.fn(() => listDataView.isLoading)
    autorun(jestFn)
    await listDataView.search({
      selector: {
        limit: [0, 10]
      }
    })

    await listDataView.infinite(10, 20)
    expect(listDataView.data.length).toBe(30)
    expect(listDataView.data[1]).toMatchSnapshot()
    expect(listDataView.data[1].label).toBe('withdrawal')
    expect(jestFn).toBeCalledTimes(5)

    await listDataView.infinite(20, 60)
    expect(listDataView.data.length).toBe(90)
    expect(listDataView.data[44].label).toBe('primary')
    expect(jestFn).toBeCalledTimes(7)
  })
})
