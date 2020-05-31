import { skeleton, Collection } from '../src'
import Me from './models/Me'
import Staff from './models/Staff'
import Department from './models/Department'
import PropertySet from './models/PropertySet'

export class Store extends skeleton(Collection) {
  public static types = [Me, Staff, Department, PropertySet]
}

export const collection = new Store()
