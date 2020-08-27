# mobx-cobweb

`mobx-cobweb`  is a front-end state management library based on [datx](https://datx.dev/docs/next/getting-started/installation) encapsulation, which implements the encapsulation call of `REST` interface

## Installation

To install, use `npm` or `yarn`. The lib has a peer dependency of `mobx` 4.2.0 or later.



## Polyfill

The lib makes use of the following features that are not yet available everywhere. Based on your browser support, you might want to polyfill them:

* [Symbol.for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
* [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
* [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)



## Define Model

The models can be defined by extending the [`Model`](https://datx.dev/docs/next/api-reference/model) class. When extending the [`Model`](https://datx.dev/docs/next/api-reference/model) class, the minimal thing you should do is to define a unique [`type`](https://datx.dev/docs/next/api-reference/model#static-type) (can be either a number or a string)



```ts
import { Model } from 'mobx-cobweb';

class Person extends Model {
  static type = 'person';
  static endpoint = '/api/person' // REST api to fetch `Person` 
  static enableStroage = true // persisted locally tag
  
  @Attribute({isIdentifier : true}) id: string
  @Attribute() name: string
}

```



## Persisting data locally

Sometimes, you'll need to persist some data locally. Bellow is a basic example using `localStorage`, but the same concept can be applied to any type of persistence:

```tsx
import { Collection } from 'mobx-cobweb';
import Person from './models/Person'

class AppStore extends Collection {
  static types = [Person] 
  static storage = { 
  	key : "__LOCAL_MODELS__",
    engine: localStorage
  }
}

const collection = new AppStore()
collection.load() // Load persisted locally data to collection
collection.recording() // Listening requires for Persisting


```

* This procedure saves all models with the storage tag turned on` ( static enableStroage = true )`

* You can also use  [localForage](https://github.com/localForage/localForage) or your own storage API, You only need to implement 
  * `getItem(key: string)`
  * `setItem(key:string ,value: string)`



## API



### Collection

The `Collection` is a combination of the [`datx Collection`](https://datx.dev/docs/next/api-reference/collection) and the `withNetActions` and `withStorage` mixins:

To learn more visit [datx Collection](https://datx.dev/docs/next/api-reference/collection) 



#### `static` register

Dynamically add the` Model definition` to the collection

#### register

Dynamically add the` Model definition` to the collection, just like `static register`

#### findOrphan

Query the singleton model instance in collection



#### withStorage

API implementation for persistent storage

##### load 

Loads local data into the collection, this is async function.

##### recording

Start the listening process and save all marked models.

return a despose function

##### static storage 

Local storage configuration

* `storage.key`   Key for stored locally
* `storage.engine`  Local storage engine
  * getItem(key) 
  * setItem(key,value)

#### withNetActions

Network API implementation

##### fetch

Use REST API to request data in the backend and add the return value to the local collection.

##### ffetch

Call `find` before calling `fetch` , return a DataRef value.

##### removeOne

Delete a remote model and, if successful, delete the model in the local collection

##### setNetworkAdapter

Inject a network proxy implementation

You need to implement the `INetworkAdapter`  interface

### Model

The `Model` is a combination of the [`datx Model`](https://datx.dev/docs/next/api-reference/model) and the `withNetActions` and `withStorage` mixins:



#### withNetActions

Network API implementation



##### refresh

Use the `REST GET(ID) API` to force a refresh of the current model(skipping the cache).

##### upsert

Use the `REST PUT API` to create or update a model to the backend.

##### remove

Use the `REST DELETE API` to DELETE a model.

##### request

Other REST apis are called, and the return value needs to be handled manually.

##### fetchRef

The reference value of the current model that calls the `REST GET(ID) API`.

##### fetchRefs

All reference values for the current model that invoke the `REST GET(ID) API`.



#### withStorage

##### static enableStorage : boolean

Enable local storage tags, and if so, all instances defined in this model will be stored locally when they are changed



#### OrphanModel

Defines a `singleton reference model` that gives a default permanent `ID` implementation
