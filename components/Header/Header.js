import React from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import { lightBlue700, white } from 'material-ui/styles/colors'
import InfoIcon from 'material-ui/svg-icons/action/info-outline'
import HelpIcon from 'material-ui/svg-icons/action/help-outline'
import { ServerEventListener } from 'ap-widget-repo'
import Snackbar from 'material-ui/Snackbar'

import LogoImage from './assets/SICK.png'

const styles = {
  toolbar: {
    width: '100%',
    height: 55,
    backgroundColor: lightBlue700,
    color: white
  },
  logo: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    paddingLeft: 110,
    backgroundImage: `url(${LogoImage})`
  },
  title: {
    fontSize: 24
  },
  icon: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 30
  }
}

/**
 * React component that encapsulates the Header tool bar displayed in the template.
 *
 */
export default class Header extends React.Component {

  constructor (props) {
    super(props)
    this.state = { snackbar: { open: false, message: '' } }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this)
  }

  /**
   * Handles new messge. Displays the message in a snackbar
   * @param {Object} data New message on websocket
   */
  handleMessage = (data) => {
    const message = Array.isArray(data) ? data[0].message : 'Invalid Message format'
    const snackbar = { open: true, message: message }
    this.setState({ snackbar: snackbar })
  }

  /**
   * Called when snackbar is closed. Used to reset snackbar state.
   */
  handleSnackBarClose = () => {
    const snackbar = { open: false, message: '' }
    this.setState({ snackbar: snackbar })
  }

  render () {
    return (
      <div>
        <Toolbar style={styles.toolbar}>
          <ToolbarGroup style={styles.logo}>
            <span id='il-header-title' style={styles.title}>Intralogistics Analytics</span>
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <InfoIcon id='il-header-info' color={white} />
            <span style={styles.icon} >About</span>
            <HelpIcon id='il-header-help' color={white} />
            <span style={styles.icon}>Help</span>
          </ToolbarGroup>
        </Toolbar>
        <ServerEventListener
          channel='notification_events'
          callback={this.handleMessage}
        />
        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={10000}
          onRequestClose={this.handleSnackBarClose}
        />
      </div>
    )
  }
}

Header.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
}
