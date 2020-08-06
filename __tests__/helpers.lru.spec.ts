/***************************************************
 * Created by nanyuantingfeng on 2020/7/15 19:59. *
 ***************************************************/
import { LRU } from '../src/helpers/lru'

describe('LRU', () => {
  it('basic test', () => {
    const lru = new LRU(5, 1000)

    lru.set(1, 1)
    expect(lru.toString()).toEqual('1')
    lru.set(2, 2)
    expect(lru.toString()).toEqual('1 <-> 2')
    lru.set(3, 3)
    expect(lru.toString()).toEqual('1 <-> 2 <-> 3')
    lru.set(4, 4)
    expect(lru.toString()).toEqual('1 <-> 2 <-> 3 <-> 4')
    lru.set(5, 5)
    expect(lru.toString()).toEqual('1 <-> 2 <-> 3 <-> 4 <-> 5')
    lru.get(1)
    expect(lru.toString()).toEqual('2 <-> 3 <-> 4 <-> 5 <-> 1')
    lru.get(2)
    expect(lru.toString()).toEqual('3 <-> 4 <-> 5 <-> 1 <-> 2')
    lru.set(6, 6)
    expect(lru.toString()).toEqual('4 <-> 5 <-> 1 <-> 2 <-> 6')
    lru.set(7, 7)
    expect(lru.toString()).toEqual('5 <-> 1 <-> 2 <-> 6 <-> 7')
    lru.set(8, 8)
    expect(lru.toString()).toEqual('1 <-> 2 <-> 6 <-> 7 <-> 8')
  })

  it('should be run clean', () => {
    const lru = new LRU(5, 1000)
    lru.set(1, 1)
    lru.set(2, 1)
    lru.set(3, 1)
    expect(lru.toString()).toEqual('1 <-> 2 <-> 3')
    lru.clear()
    expect(lru.toString()).toEqual('')
  })

  it('should be run remove', () => {
    const lru = new LRU(5, 1000)
    lru.set(1, 1)
    lru.set(2, 1)
    lru.set(3, 1)
    lru.remove(2)
    expect(lru.toString()).toEqual('1 <-> 3')
    lru.set(4, 1)
    expect(lru.toString()).toEqual('1 <-> 3 <-> 4')
    lru.get(3)
    expect(lru.toString()).toEqual('1 <-> 4 <-> 3')
    lru.remove(4)
    expect(lru.toString()).toEqual('1 <-> 3')
  })

  it('should be remove at over maxAge', async () => {
    const lru = new LRU(5, 1000)
    lru.set(1, 1)
    expect(lru.toString()).toEqual('1')
    lru.set(2, 2)
    expect(lru.toString()).toEqual('1 <-> 2')

    await new Promise((resolve) => setTimeout(resolve, 1100))
    expect(lru.get(2)).toBeNull()
    expect(lru.toString()).toEqual('1')
    expect(lru.get(1)).toBeNull()
  })
})
