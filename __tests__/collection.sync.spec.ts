import { collection, useFixturesByGET } from './config'
import Department from './models/Department'
import { modelToJSON } from '../src'
const path = require('path')

describe('collection.sync by list-data', () => {
  let scope: any = null

  beforeAll(() => {
    scope = useFixturesByGET()
  })

  beforeEach(() => {
    collection.removeAll(Department)
  })

  const data: object[] = require(path.join(__dirname, './fixtures/organization.departments.json')).items

  test('should sync IRawData', () => {
    const sf = collection.sync<Department>({ type: 'organization.Department', data })
    expect(sf[0].children[0].parentId === sf[0]).toBeTruthy()
    expect(collection.findAll(Department).length).toBe(2035)

    const dd = collection.findOne<Department>(Department, '875fdcddd47e')
    expect(dd.parentId.id).toBe('66f58b59c384')
    expect(dd.name).toBe('Bedfordshire')
    expect(modelToJSON(dd)).toMatchSnapshot()
  })
})

describe('collection.sync by tree-data', () => {
  let scope: any = null

  beforeAll(() => {
    scope = useFixturesByGET()
  })

  beforeEach(() => {
    collection.removeAll(Department)
  })

  const data: object[] = require(path.join(__dirname, './fixtures/organization.departments.tree.json')).items

  test('should sync data & type', () => {
    const sf = collection.sync<Department>(Department, data)
    expect(sf[0].children[0].parentId === sf[0]).toBeTruthy()
    expect(collection.findAll(Department).length).toBe(2035)

    const dd = collection.findOne<Department>(Department, '875fdcddd47e')
    expect(dd.parentId.id).toBe('66f58b59c384')
    expect(dd.name).toBe('ADP')
    expect(modelToJSON(dd)).toMatchSnapshot()
  })
})
