import fetch from 'isomorphic-fetch'
import { Collection, NetworkAdapter } from '../../src'
import Me from '../models/Me'
import Staff from '../models/Staff'
import Department from '../models/Department'
import PropertySet from '../models/PropertySet'
import User from '../models/User'
import TreeDataDEMOModel from '../models/TreeDataDEMOModel'

export class MyCollection extends Collection {
  static types = [Me, Staff, Department, PropertySet, User, TreeDataDEMOModel]
}

export const collection = new MyCollection()

collection.setNetworkAdapter(new NetworkAdapter('http://127.0.0.1:3000/api/v1', fetch))
