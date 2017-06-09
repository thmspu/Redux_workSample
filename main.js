import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './containers/AppContainer'
import * as WidgetRepo from 'ap-widget-repo'
import { browserHistory } from 'react-router'
import { updateLocation } from './store/location'

// ========================================================
// Store Instantiation
// ========================================================
/**
 * As Redux cannot work with multiple stores and Widget repo already has a redux store, we
 * are using the widget repo store to add template's reducers. This is a temporary work-around
 * and long term solution is discussed with product owner and needs to be prioritized
 */
const store = WidgetRepo.store
store.asyncReducers = {}

// To unsubscribe, invoke `store.unsubscribeHistory()` anytime
store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer routes={routes} store={store} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
/* eslint-disable */
//const url = 'http://localhost:8080'

const url = window.location.origin

__webpack_public_path__ = url + '/js/'
/* eslint-enable */

// ========================================================
// Configure SICK Platform
// ========================================================

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// This dependency is temporary and will eventually go away eventually
WidgetRepo.registerTapEvents()

WidgetRepo.configure({
  webSocket: {
    url: url + '/websocket/sockjs',
    reconnect: true,
    reconnectInterval: 5,
    maxRetries: 5
  }
})

// initAppBar(store)

render()
