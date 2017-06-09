import { Map, Record } from 'immutable'
import { get, post, put, del } from '../../../utils/httpRequest'

// ------------------------------------
// Constants
// ------------------------------------
export const SYSTEM_LIST_RECEIVED = 'SICKPlatform/config/SYSTEM_LIST_RECEIVED'
export const FACILITY_CONFIG_RECEIVED = 'SICKPlatform/config/FACILITY_CONFIG_RECEIVED'
export const SELECT_SYSTEM = 'SICKPlatform/config/SELECT_SYSTEM'
export const ADD_SYSTEM = 'SICKPlatform/config/ADD_SYSTEM'
export const SYSTEM_ADDED = 'SICKPlatform/config/SYSTEM_ADDED'
export const IN_PROGRESS = 'SICKPlatform/config/IN_PROGRESS'
export const OPERATION_FAILED = 'SICKPlatform/config/OPERATION_FAILED'

// ------------------------------------
// Actions
// ------------------------------------
const systemsReceived = (payload) => ({ type: SYSTEM_LIST_RECEIVED, payload })

const facilityConfigReceived = (payload) => ({ type: FACILITY_CONFIG_RECEIVED, payload })

const systemSelected = (systemName) => ({ type: SELECT_SYSTEM, systemName })

const systemAdded = (msg) => ({ type: SYSTEM_ADDED, msg })

const operationInProgress = () => ({ type: IN_PROGRESS })

const operationFailed = (msg) => ({ type: OPERATION_FAILED, msg })

/**
 * Function to get list of systems from server.
 */
export const getSystems = () => {
  return (dispatch) => {
    return get('/system')
      .then(response => (response.json()))
      .then((payload) => {
        dispatch(systemsReceived(payload))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

/**
 * Function to get list of systems from server.
 */
export const getFacilityConfig = () => {
  return (dispatch) => {
    return get('/facility')
      .then(response => (response.json()))
      .then((payload) => {
        dispatch(facilityConfigReceived(payload))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const addSystem = (name, label, rc, nr, ma, mad) => {
  const system = new System({
    systemName: name,
    systemLabel: label,
    minReadCycles: rc,
    noreadThreshold: nr,
    movingAverageLength: ma,
    movingAverageWarningThreshold: mad
  })

  return (dispatch) => {
    dispatch(operationInProgress())
    return post('/system', system)
      .then((response) => {
        dispatch(systemAdded('System is added successfully'))
      })
      .catch(err => {
        console.log(err)
        dispatch(operationFailed('Add System Failed'))
      })
  }
}

export const editSystem = (name, label, rc, nr, ma, mad, selSystem) => {
  /* eslint-disable */
  const system = new System({
    systemName: name,
    systemLabel: label,
    minReadCycles: rc,
    noreadThreshold: nr,
    movingAverageLength: ma,
    movingAverageWarningThreshold: mad && mad.replace('%', ''),
    primaryStatistics: selSystem.primaryStatistics,
    primaryStatisticsWarningThreshold: selSystem.primaryStatisticsWarningThreshold && selSystem.primaryStatisticsWarningThreshold.replace('%', ''),
    secondaryStatistics: selSystem.secondaryStatistics,
    secondaryStatisticsWarningThreshold: selSystem.secondaryStatisticsWarningThreshold && selSystem.secondaryStatisticsWarningThreshold.replace('%', ''),
    codeTypeWarningThreshold: selSystem.codeTypeWarningThreshold && selSystem.codeTypeWarningThreshold.replace('%', ''),
    codeQualityWarningThreshold: selSystem.codeQualityWarningThreshold && selSystem.codeQualityWarningThreshold.replace('%', ''),
    dateAdded: selSystem.dateAdded,
    lastModified: selSystem.lastModified,
    dateAddedLabel: selSystem.dateAddedLabel,
    lastModifiedLabel: selSystem.lastModifiedLabel
  })
  /* eslint-enable */

  return (dispatch) => {
    dispatch(operationInProgress())
    return put('/system/' + selSystem.systemName, system)
      .then((response) => {
        dispatch(systemAdded('System is edited successfully'))
      })
      .catch(err => {
        console.log(err)
        dispatch(operationFailed('Edit System Failed'))
      })
  }
}

export const deleteSystem = (name) => {
  return (dispatch) => {
    dispatch(operationInProgress())
    return del('/system/' + name)
      .then((response) => {
        dispatch(systemAdded('System is deleted successfully'))
      })
      .catch(err => {
        console.log(err)
        dispatch(operationFailed('Delete System Failed'))
      })
  }
}

/**
 * Function that will be called when user selects a system in the configuration screen.
 */
export const selectSystem = (systemName) => {
  return (dispatch) => {
    dispatch(systemSelected(systemName))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
// Record containing the fields used in UI screens. Data coming from server has more fields which are unused for now.
const System = Record({
  systemName: '',
  systemLabel: '',
  minReadCycles: 0,
  noreadThreshold: 0,
  movingAverageLength: 0,
  movingAverageWarningThreshold: '',
  primaryStatistics: '',
  primaryStatisticsWarningThreshold: '',
  secondaryStatistics: '',
  secondaryStatisticsWarningThreshold: '',
  codeTypeWarningThreshold: '',
  codeQualityWarningThreshold: '',
  dateAdded: '',
  lastModified: '',
  dateAddedLabel: '',
  lastModifiedLabel: '',
  disabled: false
})

const Edit = Record({
  inProgress: false,
  outcome: '',
  message: '',
  system: new System()
})
/**
   * Truncating all the float values to 2 decimal points and then appending percentage sign
   *
   * @param {number} value
   */
function convertToPercentage (value) {
  return value && (Math.round(value * 100) / 100) + '%'
}

/**
   * Data coming from server will have nulls for fields that are not defined.
   *
   * This function replaces nulls with spaces for predictable sorting in the system table and grid view
   *
   * @param {array} data
   */
function cleanData (data) {
  return data.map((value) => {
    if (value.systemLabel === null) {
      value.systemLabel = ''
    }
    // Setting the date values to high so that they appear last in sorting order
    if (value.dateAdded === null) {
      value.dateAdded = '9999999999999'
    }
    if (value.lastModified === null) {
      value.dateAdded = '9999999999999'
    }
    value.movingAverageWarningThreshold = convertToPercentage(value.movingAverageWarningThreshold)
    value.primaryStatisticsWarningThreshold = convertToPercentage(value.primaryStatisticsWarningThreshold)
    value.secondaryStatisticsWarningThreshold = convertToPercentage(value.secondaryStatisticsWarningThreshold)
    value.codeTypeWarningThreshold = convertToPercentage(value.codeTypeWarningThreshold)
    value.codeQualityWarningThreshold = convertToPercentage(value.codeQualityWarningThreshold)

    return value
  })
}

const ACTION_HANDLERS = {
  [SYSTEM_LIST_RECEIVED]: (state, { payload }) => {
    let nextState = state

    nextState = nextState.setIn(['systems'], cleanData(payload.systemList))
    nextState = nextState.setIn(['numberOfSystemAllowed'], payload.numberOfSystemAllowed)

    return nextState
  },
  [SELECT_SYSTEM]: (state, { systemName }) => {
    let nextState = state

    const systems = nextState.get('systems')

    const selSystem = systems.find((element) => {
      return element.systemName === systemName
    })

    const selectedSystem = new System(selSystem)

    nextState = nextState.setIn(['selectedSystem'], selectedSystem)

    return nextState
  },
  [IN_PROGRESS]: (state) => {
    let nextState = state

    nextState = nextState.setIn(['edit', 'inProgress'], true)
    nextState = nextState.setIn(['edit', 'outcome'], '')
    nextState = nextState.setIn(['edit', 'message'], '')

    return nextState
  },
  [SYSTEM_ADDED]: (state, { msg }) => {
    let nextState = state

    nextState = nextState.setIn(['edit', 'inProgress'], false)
    nextState = nextState.setIn(['edit', 'outcome'], 'success')
    nextState = nextState.setIn(['edit', 'message'], msg)

    return nextState
  },
  [OPERATION_FAILED]: (state, { msg }) => {
    let nextState = state

    nextState = nextState.setIn(['edit', 'inProgress'], false)
    nextState = nextState.setIn(['edit', 'outcome'], 'failure')
    nextState = nextState.setIn(['edit', 'message'], msg)

    return nextState
  },
  [FACILITY_CONFIG_RECEIVED]: (state, { payload }) => {
    let nextState = state

    nextState = nextState.setIn(['facility'], payload)

    return nextState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
let initialState = new Map()

initialState = initialState.set('edit', new Edit())

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
