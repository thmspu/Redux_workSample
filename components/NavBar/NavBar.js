import React, { PropTypes } from 'react'
import MenuItem from 'material-ui/MenuItem'
import Menu from 'material-ui/Menu'
import ListIcon from 'material-ui/svg-icons/action/list'
import TrendingUpIcon from 'material-ui/svg-icons/action/trending-up'
import AssessmentIcon from 'material-ui/svg-icons/action/assessment'
import DownloadIcon from 'material-ui/svg-icons/action/get-app'
import BuildIcon from 'material-ui/svg-icons/action/build'
import NotificationIcon from 'material-ui/svg-icons/social/notifications'
import FormatListNumberIcon from 'material-ui/svg-icons/editor/format-list-numbered'
import { Link } from 'react-router'
import { darkBlack, lightBlue700 } from 'material-ui/styles/colors'
import './NavBar.scss'

const styles = {
  container: {
    height: '100%',
    width: 200,
    fontWeight: 400
  },
  activeLink: {
    fontSize: 14,
    color: darkBlack,
    fontWeight: 600
  },
  inactiveLink: {
    fontSize: 14
  }
}

/**
 * Component to display left navigation options in the template. Contains the links to react router navigation.
 */
export class NavBar extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  static defaultProps = {
    location: {}
  }

  constructor (props) {
    super(props)

    this.isActive = this.isActive.bind(this)
  }

  /**
   * Function to check if the given path is current. Gets the current path from props.
   */
  isActive (path) {
    if (path === this.props.location.pathname) {
      return true
    } else {
      return false
    }
  }

  render () {
    return (
      <div style={styles.container}>
        <Menu listStyle={{ paddingTop: 0 }}>
          <MenuItem primaryText='System List'
            style={styles.inactiveLink}
            disabled
            leftIcon={<ListIcon />}
          />
          <MenuItem primaryText='Longterm Read Rate'
            style={styles.inactiveLink}
            disabled
            leftIcon={<TrendingUpIcon />}
          />
          <MenuItem primaryText='Shift Statistics'
            style={styles.inactiveLink}
            disabled
            leftIcon={<AssessmentIcon />}
          />
          <Link to='/' key='il-navbar-menu-current'>
            <MenuItem primaryText='Current Results'
              style={this.isActive('/') ? styles.activeLink : styles.inactiveLink}
              leftIcon={this.isActive('/') ? <FormatListNumberIcon color={lightBlue700} /> : <FormatListNumberIcon />}
            />
          </Link>
          <MenuItem primaryText='System Status'
            style={styles.inactiveLink}
            disabled
            leftIcon={<NotificationIcon />}
          />
          <MenuItem primaryText='Data Export'
            style={styles.inactiveLink}
            disabled
            leftIcon={<DownloadIcon />}
          />
          <Link to='/config' key='il-navbar-menu-config'>
            <MenuItem primaryText='Configuration'
              style={this.isActive('/config') ? styles.activeLink : styles.inactiveLink}
              leftIcon={this.isActive('/config') ? <BuildIcon color={lightBlue700} /> : <BuildIcon />}
            />
          </Link>
        </Menu>
      </div>
    )
  }
}

NavBar.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}

export default NavBar
