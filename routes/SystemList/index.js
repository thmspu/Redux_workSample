import { injectReducer } from '../../store/reducers'
import SystemList from './containers/SystemListContainer'

export default (store) => {
  const reducer = require('./modules/systemList').default

  injectReducer(store, { key: 'systemList', reducer })

  return {
    component : SystemList
  }
}
