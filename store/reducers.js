import { combineReducers } from 'redux'
import locationReducer from './location'
import * as WidgetRepo from 'ap-widget-repo'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...WidgetRepo.reducers,
    location: locationReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
