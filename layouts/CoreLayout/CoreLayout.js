import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import Header from '../../components/Header'

import './CoreLayout.scss'
import '../../styles/core.scss'

/**
 * Layout for the system dashboard. Contains Header, Secondary Header, Left navigation and main display area.
 */
class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  render () {
    return (
      <div id='il-spa'>
        <Paper zDepth={2}>
          <Header />
        </Paper>
        {this.props.children}
      </div>
    )
  }

}

export default CoreLayout
