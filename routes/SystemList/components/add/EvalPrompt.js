import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

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
export default class EvalPrompt extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
  }

  static defaultProps = {
    open: false
  }

  render () {
    const actions = [
      <FlatButton
        label='No'
        onTouchTap={this.props.handleClose}
      />,
      <RaisedButton
        label='Yes'
        primary
        disabled
        onTouchTap={this.props.handleClose}
      />
    ]

    return (
      <div>
        <Dialog
          title='Evaluation Conditions'
          actions={actions}
          modal
          open={this.props.open}
          contentStyle={styles.dialog}
          style={styles.root}
          repositionOnUpdate={false}
        >
          Do you want to setup evaluation conditions for your new system?
        </Dialog>
      </div>
    )
  }
}
