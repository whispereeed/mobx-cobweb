/***************************************************
 * Created by nanyuantingfeng on 2020/7/29 10:26. *
 ***************************************************/
import { attribute, Collection, Model } from '../src'
import { FSCache } from './config/fscache'

describe('collection.storage', () => {
  test('should be store Model to storage', async () => {
    class Foo extends Model {
      static type = 'foo'
      static enableStorage = true

      @attribute({ isIdentifier: true }) public id: string
      @attribute() public name: string
    }

    class Store extends Collection {
      static types = [Foo]
      static storage = { engine: new FSCache() }
    }

    const store = new Store()
    await store.load()
    store.recording()
    store.add({ id: 0, name: 'aaaa' }, Foo)
    const store2 = new Store()
    await store2.load()
    store2.recording()
    expect(store2.findAll(Foo).length).toBe(1)
    expect(store2.findOne(Foo, 0)).toMatchSnapshot()
  })
})
