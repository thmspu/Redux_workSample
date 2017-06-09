import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { List, ListItem } from 'material-ui/List'
import Snackbar from 'material-ui/Snackbar'
import debounce from 'lodash/debounce'
import toNumber from 'lodash/toNumber'
import { blue500, green500, red500 } from 'material-ui/styles/colors'
import './AddSystem.scss'

const styles = {
  root: {
    paddingTop: 40
  },
  dialog: {
    width: 700
  },
  textField: {
    width: 300
  },
  floatingLabelStyle: {
    fontWeight: 400
  },
  floatingLabelFocusStyle: {
    color: blue500
  },
  underlineFocusStyle: {
    borderColor: blue500
  },
  errorStyle: {
    color: red500,
    fontWeight: 400
  },
  successStyle: {
    color: green500
  },
  underlineStyle: {
    color: blue500
  },
  list: {
    marginLeft: -16,
    fontWeight: 800
  }
}

/**
 * Component that will be used to handle adding a new system. As Edit functionality is exactly
 * the same, the same component will be used.
 */
export default class AddSystem extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    systems: PropTypes.array.isRequired,
    save: PropTypes.func.isRequired,
    edit: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    movingAverageMax: PropTypes.number.isRequired,
    selectedSystem: PropTypes.object.isRequired
  }

  static defaultProps = {
    open: false,
    systems: [],
    edit: {},
    mode: 'add',
    movingAverageMax: 366,
    selectedSystem: {}
  }

  constructor (props) {
    super(props)

    this.state = {
      name: '',
      nameErrorText: '',
      nameSuccess: false,
      label: '',
      labelErrorText: '',
      labelSuccess: true,
      rc: '',
      rcErrorText: '',
      rcSuccess: true,
      nr: '',
      nrErrorText: '',
      nrSuccess: true,
      ma: '',
      maErrorText: '',
      maSuccess: true,
      mad: '',
      madErrorText: '',
      madSuccess: true,
      showMessage: false,
      edited: false
    }

    this._delayedCallback = this._delayedCallback.bind(this)
    this._validNumberInRange = this._validNumberInRange.bind(this)
    this._NumberOfDecimalDigits = this._NumberOfDecimalDigits.bind(this)
    this._isBlank = this._isBlank.bind(this)
    this._save = this._save.bind(this)
    this._handleSnackbarClose = this._handleSnackbarClose.bind(this)
    this._checkIfSystemExists = this._checkIfSystemExists.bind(this)
    this._nameChange = debounce(this._nameChange.bind(this), 200)
    this._labelChange = debounce(this._labelChange.bind(this), 200)
    this._readCycleChange = debounce(this._readCycleChange.bind(this), 200)
    this._noreadLimitChange = debounce(this._noreadLimitChange.bind(this), 200)
    this._movingAverageLengthChange = debounce(this._movingAverageLengthChange.bind(this), 200)
    this._movingAverageDeviationChange = debounce(this._movingAverageDeviationChange.bind(this), 200)
  }

  _readCycleChange (event) {
    const value = toNumber(event.target.value)

    if (!event.target.value || this._validNumberInRange(value, 1, 1000)) {
      this.setState({ rcSuccess: true, rcErrorText: '', rc: value, edited: true })
    } else {
      this.setState({ rcSuccess: false, rcErrorText: 'Invalid entry. Enter a value between 1 and 1000.' })
    }
  }

  _noreadLimitChange (event) {
    const value = toNumber(event.target.value)

    if (!event.target.value || this._validNumberInRange(value, 1, 1000)) {
      this.setState({ nrSuccess: true, nrErrorText: '', nr: value, edited: true })
    } else {
      this.setState({ nrSuccess: false, nrErrorText: 'Invalid entry. Enter a value between 1 and 1000.' })
    }
  }

  _movingAverageLengthChange (event) {
    const value = toNumber(event.target.value)

    const max = this.props.movingAverageMax || 366

    if (!event.target.value || this._validNumberInRange(value, 1, max)) {
      this.setState({ maSuccess: true, maErrorText: '', ma: value, edited: true })
    } else {
      this.setState({ maSuccess: false, maErrorText: 'Invalid entry. Enter a value between 1 and ' + max + '.' })
    }
  }

  _NumberOfDecimalDigits (value) {
    return value.indexOf('.') !== -1 ? value.substr(value.indexOf('.') + 1).length : 0
  }

  _movingAverageDeviationChange (event) {
    const inputString = event.target.value
    const value = toNumber(event.target.value)

    if (!inputString || (!inputString.includes(' ') && this._NumberOfDecimalDigits(inputString) <= 1 &&
      !Number.isNaN(value) && (value >= 0 && value <= 100))) {
      this.setState({ madSuccess: true, madErrorText: '', mad: value, edited: true })
    } else {
      this.setState({ madSuccess: false,
        madErrorText: 'Invalid entry. Enter a value between 0 and 100, upto 1 decimal digit.' })
    }
  }

  _validNumberInRange (value, start, end) {
    if (!Number.isNaN(value) && Number.isInteger(value) && (value >= start && value <= end)) {
      return true
    } else {
      return false
    }
  }

  _delayedCallback (event, callback) {
    event.persist()
    callback(event)
  }

  _isBlank (value) {
    return !!((!value || value.replace(' ', '').length === 0))
  }

  _nameChange (event) {
    const value = event.target.value

    const reg = new RegExp('[<>&"\']')

    if (this._isBlank(value)) {
      this.setState({ nameErrorText: 'System Name is required.', nameSuccess: false })
    } else if (value.length > 64) {
      this.setState({ nameErrorText: 'System Name cannot be longer than 64 characters.', nameSuccess: false })
    } else if (reg.exec(value)) {
      this.setState({ nameErrorText: 'Invalid entry. System Name cannot contain < > & " \'', nameSuccess: false })
    } else if (this._checkIfSystemExists(value)) {
      this.setState({ nameErrorText: 'System Name is not available', nameSuccess: false })
    } else {
      this.setState({ nameErrorText: 'System Name is available', nameSuccess: true, name: value, edited: true })
    }
  }

  _checkIfSystemExists (name) {
    const { mode, selectedSystem, systems } = this.props

    if (systems.includes(name)) {
      if (mode === 'add' || selectedSystem.systemName !== name) {
        return true
      }
    }
  }

  _labelChange (event) {
    if (event.target.value && event.target.value.length > 256) {
      this.setState({ labelErrorText: 'System Label cannot be longer than 256 characters.', labelSuccess: false })
    } else {
      this.setState({ labelErrorText: '', labelSuccess: true, label: event.target.value, edited: true })
    }
  }

  _disableSave () {
    const { nameSuccess, labelSuccess, rcSuccess, nrSuccess, maSuccess, madSuccess } = this.state

    const mode = this.props.mode

    if ((mode === 'add' && nameSuccess && labelSuccess && rcSuccess && nrSuccess && maSuccess && madSuccess) ||
        this.state.edited) {
      return false
    } else {
      return true
    }
  }

  _handleSnackbarClose () {
    this.setState({ showMessage: false })
  }

  _save () {
    const { name, label, rc, nr, ma, mad } = this.state

    if (this.props.mode === 'add') {
      this.props.save(name, label, rc, nr, ma, mad)
    } else {
      this.props.save(name, label, rc, nr, ma, mad, this.props.selectedSystem)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { edit } = nextProps

    if (edit && edit.message) {
      this.setState({ showMessage: true })
    }

    if (this.props.mode === 'add' && edit.outcome === 'success') {
      this.props.handleClose('added')
    } else if (this.props.mode === 'edit' && edit.outcome === 'success') {
      // To delay going back to the system list so that edit success snackbar can be displayed
      setTimeout(() => { this.props.handleClose('edited') }, 1000)
    }
  }

  componentWillMount () {
    if (this.props.mode === 'edit') {
      const system = this.props.selectedSystem || {}
      this.setState({
        name: system.systemName,
        label: system.systemLabel,
        rc: system.minReadCycles,
        nr: system.noreadThreshold,
        ma: system.movingAverageLength,
        mad: system.movingAverageWarningThreshold
      })
    }
  }

  render () {
    const actions = [
      <FlatButton
        label='Cancel'
        onTouchTap={() => { this.props.handleClose('no-op') }}
      />,
      <RaisedButton
        label='Save'
        primary
        disabled={this._disableSave()}
        onTouchTap={this._save}
      />
    ]

    const nameErrorStyle = this.state.nameSuccess ? styles.successStyle : styles.errorStyle

    const edit = this.props.edit || {}
    const mode = this.props.mode || 'add'

    let title = 'Add New System'
    let nameValue, labelValue, rcValue, nrValue, maValue, madValue

    if (mode === 'edit' && this.props.selectedSystem) {
      const system = this.props.selectedSystem
      title = 'Edit System'
      nameValue = system.systemName
      labelValue = system.systemLabel
      rcValue = system.minReadCycles
      nrValue = system.noreadThreshold
      maValue = system.movingAverageLength
      madValue = system.movingAverageWarningThreshold.replace('%', '')
    }

    return (
      <div>
        <Dialog
          title={title}
          actions={actions}
          modal
          open={this.props.open}
          contentStyle={styles.dialog}
          style={styles.root}
          repositionOnUpdate={false}
        >
          Define information and parameters below.
          <div className='add-system-subheader'>General</div>
          <div className='asd-general'>
            <TextField
              floatingLabelText='System Name'
              floatingLabelStyle={styles.floatingLabelStyle}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              underlineFocusStyle={styles.underlineFocusStyle}
              errorText={this.state.nameErrorText}
              errorStyle={nameErrorStyle}
              underlineStyle={styles.underlineStyle}
              onChange={(event) => { this._delayedCallback(event, this._nameChange) }}
              style={styles.textField}
              defaultValue={nameValue}
            />
            <span className='asd-right-orient'>
              <TextField
                floatingLabelText='System Label'
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                errorText={this.state.labelErrorText}
                errorStyle={styles.errorStyle}
                underlineStyle={styles.underlineStyle}
                onChange={(event) => { this._delayedCallback(event, this._labelChange) }}
                style={styles.textField}
                defaultValue={labelValue}
              />
            </span>
          </div>
          <div>
            <List style={styles.list}>
              <ListItem
                primaryText='Define System Parameters'
                initiallyOpen={false}
                key={1}
                primaryTogglesNestedList
                nestedItems={[
                  <div style={{ marginLeft: 16 }} key={2}>
                    <TextField
                      floatingLabelText='Minimum # of read cycles'
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                      underlineFocusStyle={styles.underlineFocusStyle}
                      errorText={this.state.rcErrorText}
                      errorStyle={styles.errorStyle}
                      underlineStyle={styles.underlineStyle}
                      onChange={(event) => { this._delayedCallback(event, this._readCycleChange) }}
                      style={styles.textField}
                      defaultValue={rcValue}
                    />
                    <span className='asd-right-orient'>
                      <TextField
                        floatingLabelText='Limit of consecutive NoReads'
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        errorText={this.state.nrErrorText}
                        errorStyle={styles.errorStyle}
                        underlineStyle={styles.underlineStyle}
                        onChange={(event) => { this._delayedCallback(event, this._noreadLimitChange) }}
                        style={styles.textField}
                        defaultValue={nrValue}
                      />
                    </span>
                  </div>,
                  <div style={{ marginLeft: 16, marginTop: 20 }} key={4}>
                    <TextField
                      floatingLabelText='Calculate moving average from (days)'
                      floatingLabelStyle={styles.floatingLabelStyle}
                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                      underlineFocusStyle={styles.underlineFocusStyle}
                      errorText={this.state.maErrorText}
                      errorStyle={styles.errorStyle}
                      underlineStyle={styles.underlineStyle}
                      onChange={(event) => { this._delayedCallback(event, this._movingAverageLengthChange) }}
                      style={styles.textField}
                      defaultValue={maValue}
                    />
                    <span className='asd-right-orient' key={5}>
                      <TextField
                        floatingLabelText='Moving average deviation threshold (%)'
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        errorText={this.state.madErrorText}
                        errorStyle={styles.errorStyle}
                        underlineStyle={styles.underlineStyle}
                        onChange={(event) => { this._delayedCallback(event, this._movingAverageDeviationChange) }}
                        style={styles.textField}
                        defaultValue={madValue}
                      />
                    </span>
                  </div>
                ]}
              />
            </List>
          </div>
        </Dialog>
        <Snackbar
          open={this.state.showMessage}
          autoHideDuration={5000}
          message={edit.message}
          onRequestClose={this._handleSnackbarClose}
        />
      </div>
    )
  }
}
