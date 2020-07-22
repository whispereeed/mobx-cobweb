import fetch from 'isomorphic-fetch'
import { Collection, GenericModel, NetworkAdapter } from '../../src'
import Me from '../models/Me'
import Staff from '../models/Staff'
import Department from '../models/Department'
import PropertySet from '../models/PropertySet'

export class MyCollection extends Collection {
  static types = [GenericModel, Me, Staff, Department, PropertySet]
}

export const collection = new MyCollection()

collection.setNetworkAdapter(new NetworkAdapter('http://127.0.0.1:3000/api/v1', fetch))
