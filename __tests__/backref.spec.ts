/***************************************************
 * Created by nanyuantingfeng on 2020/9/4 15:39. *
 ***************************************************/
import { Collection } from '../src'
import Dir from './models/Dir'
import File from './models/File'

describe('backref', () => {
  test('should be init backref by id', async () => {
    class MyCollection extends Collection {
      static types = [Dir, File]
    }

    const collection = new MyCollection()
    const doc = collection.add<Dir>({ name: 'Doc', id: 1 }, Dir)
    const f0 = collection.add<File>({ name: 'f0', dir: 1 }, File)
    const f1 = collection.add<File>({ name: 'f1', dir: 1 }, File)
    expect(f0.dir).toBe(doc)
    expect(doc.files.length).toBe(2)
    expect(doc.files[0].name).toBe('f0')
    expect(doc.files[0]).toBe(f0)
    expect(doc.files[1]).toBe(f1)
  })
})
