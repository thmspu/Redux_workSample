import React from 'react'
import './Dashboard.scss'
import { GridList, GridTile } from 'material-ui/GridList'
import Paper from 'material-ui/Paper'
import NavBar from '../../../components/NavBar'
import { ActivityTable, TextLiveView, AppBar } from 'ap-widget-repo'
import { blueGrey100, blueGrey50 } from 'material-ui/styles/colors'

const styles = {
  nav: {
    backgroundColor: blueGrey100
  },
  main: {
    backgroundColor: blueGrey50
  },
  activityTable: {
    height: '100%',
    width: '100%',
    border: '1px solid #CCC',
    backgroundColor: '#FFFFFF',
    overflowX: 'hidden'
  }
}
/**
 * React component that encapsulates the System dashboard view.
 * @private
 */
export default class Dashboard extends React.Component {
  render () {
    return (
      <div className='main-container'>
        <Paper zDepth={2}>
          <AppBar />
        </Paper>
        <div id='il-body'>
          <nav style={styles.nav}>
            <NavBar location={location} />
          </nav>
          <main style={styles.main}>
            <div className='home-container'>
              <GridList cols={6} padding={30}>
                <GridTile rows={0.6} cols={1} id='il-sdw-primary-statistic'>
                  <TextLiveView
                    group='primary-statistic'
                    channel='primary-statistic'
                    title='Primary Statistic'
                    content='--'
                    subtext=''
                    subtextPosition='sameline'
                    url='/system/primarystatistics?system='
                    refreshInterval={60000}
                    maxRetries={5} />
                </GridTile>
                <GridTile cols={1} rows={0.6} id='il-sdw-read-rate'>
                  <TextLiveView
                    group='read-rate'
                    channel='ValidRead'
                    title='Read Rate'
                    content='--'
                    subtext=''
                    subtextPosition='newline'
                    url='/statistics/readrate?statistic=primary&system='
                    refreshInterval={1000}
                    maxRetries={5} />
                </GridTile>
                <GridTile cols={1} rows={0.6} id='il-sdw-total-objects'>
                  <TextLiveView
                    group='total-objects'
                    channel='total-objects'
                    title='Total Objects'
                    content='--'
                    subtext=''
                    subtextPosition='sameline'
                    url='/system/currentshift/validobjects?system='
                    refreshInterval={1000}
                    maxRetries={5} />
                </GridTile>
                <GridTile cols={1} rows={0.6} id='il-sdw-belt-speed'>
                  <TextLiveView
                    group='text-live-view-belt-speed'
                    channel='_speed'
                    title='Belt Speed'
                    content='--'
                    subtext=''
                    subtextPosition='sameline' />
                </GridTile>
                <GridTile cols={6} rows={2.6} id='il-activity-table'>
                  <ActivityTable
                    style={styles.activityTable}
                    title='Last 300 Objects'
                    group='activity-table'
                    channel='_activity' />
                </GridTile>
              </GridList>
            </div>
          </main>
        </div>
      </div>
    )
  }
}
