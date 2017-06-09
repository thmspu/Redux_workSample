import { connect } from 'react-redux'
import SystemList from '../components/SystemList'
import { getSystems, selectSystem, addSystem, getFacilityConfig, editSystem, deleteSystem } from '../modules/systemList'

const mapStateToProps = (state) => ({
  systemList : state.systemList
})

/* eslint-disable */
export default connect(mapStateToProps, { getSystems, selectSystem, addSystem, getFacilityConfig, editSystem, deleteSystem })(SystemList)
/* eslint-enable */
