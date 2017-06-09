import React from 'react'
import Paper from 'material-ui/Paper'
import { blueGrey100, blueGrey50 } from 'material-ui/styles/colors'

import Header from '../../components/Header'
import NavBar from '../../components/NavBar'

import './ConfigLayout.scss'
import '../../styles/core.scss'

const styles = {
  nav: {
    backgroundColor: blueGrey100
  },
  main: {
    backgroundColor: blueGrey50
  }
}

/**
 * Layout for the system list configuration screen
 */
export const ConfigLayout = ({ children }) => (
  <div id='il-spa'>
    <Paper zDepth={2}>
      <Header />
    </Paper>
    <div id='il-body'>
      <nav style={styles.nav}>
        <NavBar />
      </nav>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  </div>
)

ConfigLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default ConfigLayout
