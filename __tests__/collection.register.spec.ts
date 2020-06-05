/***************************************************
 * Created by nanyuantingfeng on 2020/6/5 13:38. *
 ***************************************************/
import { collection, Store, useFixtureGetById, useFixturesByGET } from './config'
import Staff from './models/Staff'
import { Model } from '../src'
import { prop } from 'datx'
import { action, autorun } from 'mobx'

describe('collection.register', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Staff)
  })

  test('should be used registered Model', async () => {
    useFixtureGetById(Staff.endpoint)
    const response = await collection.fetch(Staff, 'XRA9koBTaA0000:gongyanyu')
    const staff = response.data

    class StaffVM extends Model {
      static type = 'vm::Staff'

      @prop.toOne(Staff) staff: Staff
      @prop ccc: string

      @action doit(ccc: string) {
        this.ccc = ccc
        this.staff.name = ccc
      }
    }

    Store.register(StaffVM)

    const staffVM = collection.add(new StaffVM({ ccc: 'xxxxx', staff: 'XRA9koBTaA0000:gongyanyu' }))

    expect(staffVM.ccc).toBe('xxxxx')
    expect(staffVM.staff).toBe(staff)

    const fn = jest.fn(() => staffVM.staff.name)
    autorun(fn)

    staffVM.doit('dddd')
    expect(staffVM.ccc).toBe('dddd')
    expect(staffVM.staff.name).toBe('dddd')
    expect(fn).toBeCalledTimes(2)
  })
})
