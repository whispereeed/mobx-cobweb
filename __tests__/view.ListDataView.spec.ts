import { collection, useFixtureLimitByPOST, useFixturePUTById, useFixturesByGET } from './config'
import { ListDataView } from '../src'
import { autorun } from 'mobx'
import PropertySet from './models/PropertySet'
import Staff from './models/Staff'

describe('ListDataView', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    useFixtureLimitByPOST(PropertySet.endpoint)
    useFixtureLimitByPOST(Staff.endpoint)
    collection.removeAll(PropertySet)
  })

  test('should be fetched data by `page`', async () => {
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
    expect(listDataView.data[1].name).toBe('Auto Loan Account')
    expect(jestFn).toBeCalledTimes(5)

    await listDataView.last()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('Supervisor')
    expect(listDataView.data[8].name).toBe('withdrawal')
    expect(jestFn).toBeCalledTimes(7)

    await listDataView.prev()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('best-of-breed')
    expect(listDataView.data[8].name).toBe('Berkshire')
    expect(listDataView.data[9].name).toBe('calculating')
    expect(jestFn).toBeCalledTimes(9)

    await listDataView.first()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[0].name).toBe('Accounts')
    expect(listDataView.data[1].name).toBe('Solutions')
    expect(jestFn).toBeCalledTimes(11)
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

  test('should be revert model', async () => {
    const listDataView = new ListDataView<Staff>(Staff, collection)
    const sdd = await listDataView.search({
      selector: {
        limit: [0, 10]
      }
    })

    const fn = jest.fn()
    const oo: string[] = []
    autorun(() => {
      fn()
      oo.push(listDataView.data[1].name)
    })
    const staff = collection.findOne(Staff, '6ae31b1e6dda')
    staff.name = '9999'
    useFixturePUTById(Staff.endpoint, 200, { errorCode: 404, errorMessage: 'x' })
    await staff.upsert().catch((e) => {
      expect(e.error).toEqual({ errorMessage: 'x', errorCode: 404 })
    })
    expect(listDataView.data[1].name).toBe('AGP')
    expect(oo).toEqual(['AGP', '9999', 'AGP'])
    expect(fn).toBeCalledTimes(3)
  })
})
