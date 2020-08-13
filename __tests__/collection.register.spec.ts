/***************************************************
 * Created by nanyuantingfeng on 2020/6/5 13:38. *
 ***************************************************/
import { collection, MyCollection, useFixtureGetById, useFixturesByGET } from './config'
import Staff from './models/Staff'
import { Model, attribute } from '../src'
import { action, autorun } from 'mobx'

describe('collection.register', () => {
  let scope: any = null

  beforeEach(() => {
    scope = useFixturesByGET()
    collection.removeAll(Staff)
  })

  test('should be used static function collection.register(Model)', async () => {
    useFixtureGetById(Staff.endpoint)
    const response = await collection.fetch<Staff>(Staff, 'cdb28c900c75')
    const staff = response.data

    expect(staff).toBeInstanceOf(Staff)

    class StaffVM extends Model {
      static type = 'vm::Staff_2'

      @attribute({ toOne: Staff }) staff: Staff
      @attribute() ccc: string

      @action test(ccc: string) {
        this.ccc = ccc
        this.staff.name = ccc
      }
    }

    MyCollection.register(StaffVM)

    const staffVM = collection.add(new StaffVM({ ccc: 'xxxxx', staff: 'cdb28c900c75' }, collection))

    expect(staffVM.ccc).toBe('xxxxx')
    expect(staffVM.staff).toBe(staff)

    const fn = jest.fn(() => staff.name)
    autorun(fn)

    staffVM.test('dddd')
    expect(staffVM.ccc).toBe('dddd')
    expect(staffVM.staff.name).toBe('dddd')
    expect(fn).toBeCalledTimes(2)
  })

  test('should be used instance function collection.register(Model)', async () => {
    useFixtureGetById(Staff.endpoint)
    const response = await collection.fetch<Staff>(Staff, 'cdb28c900c75')
    const staff = response.data

    expect(staff).toBeInstanceOf(Staff)

    class StaffVM extends Model {
      static type = 'vm::Staff'

      @attribute({ toOne: Staff }) staff: Staff
      @attribute() ccc: string

      @action test(ccc: string) {
        this.ccc = ccc
        this.staff.name = ccc
      }
    }

    collection.register([StaffVM])

    const staffVM = collection.add(new StaffVM({ ccc: 'xxxxx', staff: 'cdb28c900c75' }, collection))

    expect(staffVM.ccc).toBe('xxxxx')
    expect(staffVM.staff).toBe(staff)
    expect(staffVM.staff.id).toBe(staff.id)

    const fn = jest.fn(() => staff.name)
    autorun(fn)

    staffVM.test('dddd')
    expect(staffVM.ccc).toBe('dddd')
    expect(staffVM.staff.name).toBe('dddd')
    expect(fn).toBeCalledTimes(2)
  })
})
