import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import CreateIcon from 'material-ui/svg-icons/content/create'
import './Preview.scss'

/**
 * React component to visualize Preview pane when a system is selected. Receives the selected system details as props
 */
export default class Preview extends Component {

  static propTypes = {
    selectedSystem: PropTypes.object.isRequired,
    handleEdit: PropTypes.func.isRequired
  }

  static defaultProps = {
    selectedSystem: {}
  }

  render () {
    const system = this.props.selectedSystem

    return (
      <div className='preview-container'>
        <Paper zDepth={1}>
          <div className='pc-system-name'>
            {system.systemName}
            <div className='pc-label-edit'>
              {!system.disabled &&
                <IconButton onTouchTap={() => { this.props.handleEdit(system.systemName) }} >
                  <CreateIcon />
                </IconButton>
              }
            </div>
          </div>
          <div className='pc-system-label'>{system.systemLabel || <br />}</div>
          <div className='pc-subheading'>Settings</div>
          <div className='pc-label'>
            Min. # of read cycles:
            <span className='pc-value'>{system.minReadCycles}</span>
          </div>
          <div className='pc-label'>
            Limit of consecutive NoReads:
            <span className='pc-value'>{system.noreadThreshold}</span>
          </div>
          <div className='pc-label'>
            Calculate moving average from:
            <span className='pc-value'>{system.movingAverageLength && system.movingAverageLength + ' days'}</span>
          </div>
          <div className='pc-label'>
            Warning threshold deviation:
            <span className='pc-value'>{system.movingAverageWarningThreshold}</span>
          </div>
          <div className='pc-subheading'>Thresholds</div>
          <div className='pc-label'>
            {system.primaryStatistics && system.primaryStatistics + ':'}
            <span className='pc-value'>{system.primaryStatisticsWarningThreshold}</span>
          </div>
          <div className='pc-label'>
            {system.secondaryStatistics && system.secondaryStatistics + ':'}
            <span className='pc-value'>{system.secondaryStatisticsWarningThreshold}</span>
          </div>
          <div className='pc-label'>
            Code type:
            <span className='pc-value'>{system.codeTypeWarningThreshold}</span>
          </div>
          <div className='pc-label'>
            Code quality:
            <span className='pc-value'>{system.codeQualityWarningThreshold}</span>
          </div>
          <div className='pc-button'>
            {!system.disabled &&
              <FlatButton label='view system' />
            }
          </div>
          <br />
        </Paper>
      </div>
    )
  }
}
