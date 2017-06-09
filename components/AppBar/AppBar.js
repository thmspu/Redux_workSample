import React, { PropTypes } from 'react'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import { white, lightBlack, darkBlack } from 'material-ui/styles/colors'

import { connect } from 'react-redux'
// import { getSystems, switchSystem } from './reducer'

const mapStateToProps = (state) => ({
  appbar : state.appbar
})

const styles = {
  appbar: {
    backgroundColor: white,
    height: 45,
    fontSize: 12,
    color: lightBlack
  },
  dropdown: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 180,
    color: darkBlack
  },
  systemLabel: {
    marginLeft: -20,
    marginTop: 5
  },
  shiftLabel: {
    marginLeft: 30,
    marginTop: 5
  },
  button: {
    height: 32
  }
}

/**
 * Component for rendering secondary header in the template
 */
export class AppBar extends React.Component {

  /** @ignore */
  static propTypes = {
    appbar: PropTypes.object.isRequired
    // getSystems: PropTypes.func,
    // switchSystem: PropTypes.func
  }

  /** @ignore */
  static defaultProps = {
    appbar: {}
  }

  /** @ignore */
  constructor (props, context) {
    super(props, context)

    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount () {
    // this.props.getSystems()
  }

  handleChange = (event, index, value) => {
    // this.props.switchSystem(value)
  }

  render () {
    const appbar = this.props.appbar

    const systems = appbar.get('systems') ? appbar.get('systems').keySeq().toArray() : []

    let selSystemName = '01'
    let selSystemLabel = 'Default System'

    if (appbar.get('selectedSystem')) {
      selSystemName = appbar.get('selectedSystem').get('systemName')
      selSystemLabel = appbar.get('selectedSystem').get('systemLabel')
    } else if (systems.length > 0) {
      selSystemName = systems[0]
      selSystemLabel = appbar.get('systems').get(selSystemName)
    }

    return (
      <Toolbar style={styles.appbar}>
        <ToolbarGroup>
          <DropDownMenu id='il-appbar-system-selection' value={selSystemName}
            onChange={this.handleChange} style={styles.dropdown}>
            {systems.map((name) =>
              <MenuItem key={name} value={name} primaryText={name} />
            )}
          </DropDownMenu>
          <span id='il-appbar-system-label' style={styles.systemLabel}>{selSystemLabel}</span>
          <span id='il-appbar-sort-label' style={styles.shiftLabel}>Morning Shift</span>
        </ToolbarGroup>
        <ToolbarGroup lastChild>
          <RaisedButton id='il-appbar-reset-button'
            label='Reset'
            primary
            buttonStyle={styles.button} />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

AppBar.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { })(AppBar)
