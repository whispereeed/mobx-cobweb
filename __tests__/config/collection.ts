import { Collection, GenericModel } from '../../src'
import Me from '../models/Me'
import Staff from '../models/Staff'
import Department from '../models/Department'
import PropertySet from '../models/PropertySet'

export class Store extends Collection {
  static types = [GenericModel, Me, Staff, Department, PropertySet]
}

export const collection = new Store()
