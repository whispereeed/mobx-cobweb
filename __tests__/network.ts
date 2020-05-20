import fetch from 'isomorphic-fetch'
import { setNetworkAdapter, NetworkAdapter } from '../src'

setNetworkAdapter(new NetworkAdapter('http://127.0.0.1:3000/api/v1', fetch))
