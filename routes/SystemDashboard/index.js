import { injectReducer } from '../../store/reducers'
import Dashboard from './containers/DashboardContainer'

export default (store) => {
  const reducer = require('./modules/dashboard').default

  injectReducer(store, { key: 'dashboard', reducer })

  return {
    component : Dashboard
  }
}

/**
export default () => {
  return {
    component: Dashboard
  }
}
 */
