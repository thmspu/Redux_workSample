import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow700 } from 'material-ui/styles/colors'

const styles = {
  root: {
    paddingTop: 40
  },
  dialog: {
    width: 400
  }
}

/**
 * Component to display Evaluation Conditions prompt on successully adding a system.
 */
export default class DeletePrompt extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    edit: PropTypes.object.isRequired
  }

  static defaultProps = {
    open: false,
    edit: {},
    name: ''
  }

  constructor (props) {
    super(props)

    this.state = {
      showMessage: false
    }

    this._handleSnackbarClose = this._handleSnackbarClose.bind(this)
  }

  _handleSnackbarClose () {
    this.setState({ showMessage: false })
  }

  componentWillReceiveProps (nextProps) {
    const { edit } = nextProps

    if (edit && edit.message) {
      this.setState({ showMessage: true })
    }

    // To delay going back to the system list so that edit success snackbar can be displayed
    setTimeout(() => { this.props.handleClose() }, 1000)
  }

  render () {
    const actions = [
      <FlatButton
        label='cancel'
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label='accept'
        primary
        onTouchTap={() => { this.props.handleDelete(this.props.name) }}
      />
    ]

    const edit = this.props.edit || {}

    return (
      <div>
        <Dialog
          title='Delete System'
          actions={actions}
          modal
          open={this.props.open}
          contentStyle={styles.dialog}
          style={styles.root}
          repositionOnUpdate={false}
        >
          <span style={{ width: '10%' }}>
            <WarningIcon color={yellow700} />
          </span>
          <span style={{ width: '90%', float: 'right' }}>
            By deleting this system, you will lose all configurations
            including devices, groups, evaluation conditions and statistics.
          </span>
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
