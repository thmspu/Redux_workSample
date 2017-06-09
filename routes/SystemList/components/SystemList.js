import React, { PropTypes } from 'react'
import './SystemList.scss'
import IconButton from 'material-ui/IconButton'
import AppsIcon from 'material-ui/svg-icons/navigation/apps'
import ListIcon from 'material-ui/svg-icons/action/list'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import NavBar from '../../../components/NavBar'
import { blueGrey100, blueGrey50, white, lightBlack, darkBlack } from 'material-ui/styles/colors'
import SystemTable from './SystemTable'
import GridView from './GridView'
import Preview from './Preview'
import AddSystem from './add/AddSystem'
import EvalPrompt from './add/EvalPrompt'
import DeletePrompt from './delete/DeletePrompt'

const styles = {
  nav: {
    backgroundColor: blueGrey100
  },
  main: {
    backgroundColor: blueGrey50
  },
  appbar: {
    backgroundColor: white,
    height: 45,
    fontSize: 12,
    color: lightBlack
  },
  primaryText: {
    marginLeft: 220,
    marginTop: 5,
    fontSize: 16,
    fontWeight: 800,
    color: darkBlack
  },
  secondaryText: {
    marginLeft: 30,
    marginTop: 5,
    fontSize: 12
  },
  button: {
    height: 30,
    marginRight: 30
  },
  appIcon: {
    width: 30,
    height: 28
  },
  simpleItem: {
    fontSize: 14,
    fontWeight: 400,
    color: lightBlack
  },
  boldItem: {
    fontSize: 14,
    fontWeight: 800,
    color: darkBlack
  }
}

/**
 * React component that encapsulates the System Configuration view.
 * @private
 */
export default class SystemList extends React.Component {

  /** @ignore */
  static propTypes = {
    systemList: PropTypes.object.isRequired,
    selectSystem: PropTypes.func.isRequired,
    getSystems: PropTypes.func.isRequired,
    getFacilityConfig: PropTypes.func.isRequired,
    addSystem: PropTypes.func.isRequired,
    editSystem: PropTypes.func.isRequired,
    deleteSystem: PropTypes.func.isRequired
  }

  /** @ignore */
  static defaultProps = {
    systemList: {}
  }

  constructor (props) {
    super(props)

    this.state = {
      mode: 'list',
      sortBy: 'systemName',
      sortDirection: 'asc',
      dialogOpen: false,
      dialogMode: 'add',
      evalDialogOpen: false,
      deleteDialogOpen: false
    }

    this._toggleView = this._toggleView.bind(this)
    this._sort = this._sort.bind(this)
    this._isSortedBy = this._isSortedBy.bind(this)
    this._getItemStyle = this._getItemStyle.bind(this)
    this._toggleSort = this._toggleSort.bind(this)
    this._selectSystem = this._selectSystem.bind(this)
    this._addSystem = this._addSystem.bind(this)
    this._closeDialog = this._closeDialog.bind(this)
    this._editSystem = this._editSystem.bind(this)
    this._deleteSystem = this._deleteSystem.bind(this)
    this._closeEvalPrompt = this._closeEvalPrompt.bind(this)
    this._closeDeletePrompt = this._closeDeletePrompt.bind(this)
  }

  _selectSystem (name) {
    this.props.selectSystem(name)
  }

  _toggleView () {
    let { mode } = this.state
    mode = mode === 'list' ? 'tile' : 'list'
    this.setState({ mode: mode })
  }

  _sort (event, index, sortBy) {
    this.setState({ sortBy: sortBy })
  }

  _toggleSort () {
    const sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc'
    this.setState({ sortDirection: sortDirection })
  }

  _isSortedBy (field) {
    if (this.state.sortBy === field) {
      return true
    } else {
      return false
    }
  }

  _getItemStyle (item) {
    if (this.state.sortBy === item) {
      return styles.boldItem
    } else {
      return styles.simpleItem
    }
  }

  _addSystem (event, index, value) {
    this.setState({ dialogOpen: true, dialogMode: 'add' })
  }

  _editSystem (name) {
    this.setState({ dialogOpen: true, dialogMode: 'edit' })
  }

  _closeDialog (outcome) {
    if (outcome === 'added') {
      this.setState({ dialogOpen: false, evalDialogOpen: true })
    } else {
      this.setState({ dialogOpen: false, evalDialogOpen: false })
    }
    this.props.getSystems()
    this.props.selectSystem('')
  }

  _closeEvalPrompt () {
    this.setState({ evalDialogOpen: false })
  }

  _deleteSystem (name) {
    this.setState({ deleteDialogOpen: true })
  }

  _closeDeletePrompt () {
    this.setState({ deleteDialogOpen: false })
    this.props.getSystems()
    this.props.selectSystem('')
  }

  /**
   * Gets the list of systems from server when the component is about to mount
   */
  componentWillMount () {
    this.props.getSystems()
    this.props.getFacilityConfig()
  }

  render () {
    const listMode = this.state.mode === 'list'

    const systems = this.props.systemList.get('systems') || []

    const edit = this.props.systemList.get('edit') || {}

    const facility = this.props.systemList.get('facility') || {}

    const systemNames = systems.map((value) => { return value.systemName })

    const selectedSystem = this.props.systemList.get('selectedSystem')

    const availSystems = this.props.systemList.get('numberOfSystemAllowed')

    const movingAverageMax = facility.objectDurationDays

    const saveAction = this.state.dialogMode === 'add' ? this.props.addSystem : this.props.editSystem

    return (
      <div className='main-container'>
        <div id='il-body'>
          <nav style={styles.nav}>
            <NavBar location={location} />
          </nav>
          <main style={styles.main}>
            <div className='config-system-list'>
              {!listMode &&
                <span>
                  {this.state.sortDirection === 'asc'
                    ? <IconButton iconStyle={{ marginBottom: -3 }} onTouchTap={this._toggleSort}>
                      <ArrowUpIcon />
                    </IconButton>
                    : <IconButton iconStyle={{ marginBottom: -3 }} onTouchTap={this._toggleSort}>
                      <ArrowDownIcon />
                    </IconButton>
                  }
                  <span id='config-sl-dropdown'>
                    <DropDownMenu
                      value={this.state.sortBy}
                      onChange={this._sort}
                      selectedMenuItemStyle={styles.boldItem}
                      iconButton={false}
                      underlineStyle={{ borderTop: 0 }}
                      labelStyle={{ lineHeight: '20px' }}
                      style={{ height: 30, paddingTop: 10 }}
                    >
                      <MenuItem
                        value='systemName'
                        primaryText='System Name'
                        style={styles.simpleItem} />
                      <MenuItem
                        value='systemLabel'
                        primaryText='System Label'
                        style={styles.simpleItem} />
                      <MenuItem
                        value='dateAdded'
                        primaryText='Date Added'
                        style={styles.simpleItem} />
                      <MenuItem
                        value='lastModified'
                        primaryText='Last Modified'
                        style={styles.simpleItem} />
                    </DropDownMenu>
                  </span>
                </span>
              }
              <span className='config-sl-button'>
                <IconButton
                  onTouchTap={this._toggleView}
                  style={styles.button}
                  iconStyle={styles.appIcon}
                >
                  {listMode ? <AppsIcon color={lightBlack} />
                    : <ListIcon color={lightBlack} />
                  }
                </IconButton>
              </span>
              {listMode
                ? <SystemTable
                  selectSystem={this._selectSystem}
                  selectedSystem={selectedSystem}
                  data={systems}
                  handleEdit={this._editSystem}
                  handleDelete={this._deleteSystem}
                />
                : <GridView
                  selectSystem={this._selectSystem}
                  selectedSystem={selectedSystem}
                  data={systems}
                  handleEdit={this._editSystem}
                  handleDelete={this._deleteSystem}
                  sortBy={this.state.sortBy}
                  sortDirection={this.state.sortDirection} />
              }
            </div>
            <div className='config-preview'>
              <div className='config-available-systems-label'>
                {systems.length} of {availSystems} Available Systems
              </div>
              {selectedSystem && selectedSystem.systemName &&
                <Preview
                  selectedSystem={selectedSystem}
                  handleEdit={this._editSystem}
                />
              }
              <div className='config-sl-fab'>
                {(systems.length < availSystems) &&
                  <FloatingActionButton onClick={this._addSystem}><ContentAdd /></FloatingActionButton>
                }
              </div>
            </div>
            {this.state.dialogOpen &&
              <AddSystem
                mode={this.state.dialogMode}
                open
                handleClose={this._closeDialog}
                save={saveAction}
                edit={edit}
                systems={systemNames}
                movingAverageMax={movingAverageMax}
                selectedSystem={selectedSystem}
              />
            }
            {this.state.evalDialogOpen &&
              <EvalPrompt
                open
                handleClose={this._closeEvalPrompt}
              />
            }
            {this.state.deleteDialogOpen &&
              <DeletePrompt
                open
                name={selectedSystem.systemName}
                edit={edit}
                handleDelete={this.props.deleteSystem}
                handleClose={this._closeDeletePrompt}
              />
            }
          </main>
        </div>
      </div>
    )
  }
}
