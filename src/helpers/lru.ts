/***************************************************
 * Created by nanyuantingfeng on 2020/7/15 17:47. *
 ***************************************************/

class Node<T> {
  key: string | number
  data: any
  next: Node<T>
  prev: Node<T>
  constructor(key: string | number, data: T) {
    this.key = key
    this.data = data
    this.next = null
    this.prev = null
  }
}

export default class LRU<T> {
  private readonly capacity: number
  private keys: Record<string | number, Node<T>>
  private head: Node<T>
  private tail: Node<T>

  constructor(capacity: number) {
    this.capacity = capacity
    this.clear()
  }

  private __remove(node: Node<T>) {
    const prev = node.prev
    const next = node.next
    prev.next = next
    next.prev = prev
  }

  private __add(node: Node<T>) {
    const realTail = this.tail.prev
    realTail.next = node
    this.tail.prev = node
    node.prev = realTail
    node.next = this.tail
  }

  get(key: string | number): T {
    const node = this.keys[key]
    // tslint:disable-next-line:triple-equals
    if (node == undefined) return null

    this.__remove(node)
    this.__add(node)
    return node.data
  }

  set(key: string | number, value: T) {
    // remove node from 'old' position
    const node = this.keys[key]
    if (node) this.__remove(node)

    // create new node and add at tail
    const newNode = new Node(key, value)
    this.__add(newNode)
    this.keys[key] = newNode

    // if we are over capacity then remove oldest node - its at the head
    if (Object.keys(this.keys).length > this.capacity) {
      const realHead = this.head.next
      this.__remove(realHead)
      delete this.keys[realHead.key]
    }
  }

  remove(key: string | number): void {
    const node = this.keys[key]
    // tslint:disable-next-line:triple-equals
    if (node == undefined) return null
    this.__remove(node)
  }

  forEach(fn: (node: Node<T>) => void) {
    let pointer = this.head
    let i = -1
    while (++i < this.capacity) {
      pointer = pointer.next
      if (pointer === null) break
      fn(pointer)
    }
  }

  clear() {
    this.keys = {}
    this.head = new Node('', null)
    this.tail = new Node('', null)
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  toString() {
    const oo: Array<string | number> = []
    this.forEach((node) => oo.push(node.key))
    return oo.filter(Boolean).join(' <-> ')
  }
}
