import './network'
import { useFixturesByGET, useFixtureLimitByPOST } from './nockConfig'

import { collection } from './collection'
import { ListDataView } from '../src'
import { autorun } from 'mobx'

import PropertySet from './models/PropertySet'

describe('ListDataView', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(PropertySet)
    collection.removeAll(PropertySet)
  })

  test('page', async () => {
    useFixtureLimitByPOST(PropertySet.endpoint)
    const response = await collection.fetch(PropertySet, {
      selector: {
        limit: [0, 10]
      }
    })

    expect(response.data).toBeInstanceOf(Array)
    expect((response.data as any[]).length).toBe(10)
    const listDataView = new ListDataView<PropertySet>(response)
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data[1]).toBeInstanceOf(PropertySet)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('payPlan')

    const jestFn = jest.fn(() => listDataView.isLoading)
    autorun(jestFn)

    useFixtureLimitByPOST(PropertySet.endpoint)
    await listDataView.next()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('invoiceForm')
    expect(jestFn).toBeCalledTimes(3)

    useFixtureLimitByPOST(PropertySet.endpoint)
    await listDataView.last()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('u_自hvk8l')
    expect(listDataView.data[8].name).toBe('u_金额字段2')
    expect(jestFn).toBeCalledTimes(5)

    useFixtureLimitByPOST(PropertySet.endpoint)
    await listDataView.prev()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[1].name).toBe('u_S7小白菜写')
    expect(listDataView.data[8].name).toBe('u_实体9lgt')
    expect(listDataView.data[9].name).toBe('u_测试d7tz')
    expect(jestFn).toBeCalledTimes(7)

    useFixtureLimitByPOST(PropertySet.endpoint)
    await listDataView.first()
    expect(listDataView.data.length).toBe(10)
    expect(listDataView.data).toMatchSnapshot()
    expect(listDataView.data[0].name).toBe('payPlanMode')
    expect(listDataView.data[1].name).toBe('payPlan')
    expect(jestFn).toBeCalledTimes(9)
  })

  test('infinite', async () => {
    useFixtureLimitByPOST(PropertySet.endpoint)
    const response = await collection.fetch(PropertySet, {
      selector: {
        limit: [0, 10]
      }
    })

    const listDataView = new ListDataView<PropertySet>(response)
    const jestFn = jest.fn(() => listDataView.isLoading)
    autorun(jestFn)

    useFixtureLimitByPOST(PropertySet.endpoint)
    await listDataView.infinite(10, 20)
    expect(listDataView.data.length).toBe(30)
    expect(listDataView.data[1]).toMatchSnapshot()
    expect(listDataView.data[1].label).toBe('支付计划')
    expect(jestFn).toBeCalledTimes(3)

    useFixtureLimitByPOST(PropertySet.endpoint)
    await listDataView.infinite(20, 60)
    expect(listDataView.data.length).toBe(90)
    expect(listDataView.data[44].label).toBe('核销金额')
    expect(jestFn).toBeCalledTimes(5)
  })
})
