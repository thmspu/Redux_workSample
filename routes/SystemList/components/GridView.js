import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import { GridList, GridTile } from 'material-ui/GridList'
import { lightBlue700 } from 'material-ui/styles/colors'
import EditMenu from './EditMenu'
import './GridView.scss'

const styles = {
  tile: {
    marginRight: 10,
    paddingTop: 10
  },
  paper: {
    height: '100%',
    width: '100%',
    cursor: 'pointer'
  },
  selectedTile: {
    height: '100%',
    width: '100%',
    cursor: 'pointer',
    borderColor: lightBlue700,
    borderStyle: 'solid',
    borderWidth: 1
  }
}

/**
 * React component to visualize the systems in grid view.
 */
export default class GridView extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    selectedSystem: PropTypes.object,
    selectSystem: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: [],
    sortBy: '',
    sortDirection: '',
    selectedSystem: {}
  }

  constructor (props) {
    super(props)

    /**
     * This component maintains internal state that need not be shared with other components.
     */
    this.state = {
      data: [],
      sortBy: '',
      sortDirection: ''
    }

    this._sort = this._sort.bind(this)
  }

  /**
   * Function to sort the given array by the field and direction.
   *
   * @param {array} data
   * @param {string} field
   * @param {string} direction
   */
  _sort (data, field, direction) {
    data.sort((a, b) => {
      if ((direction === 'asc' && a[field] < b[field]) || (direction === 'desc' && a[field] > b[field])) {
        return -1
      } else if ((direction === 'asc' && a[field] > b[field]) || (direction === 'desc' && a[field] < b[field])) {
        return 1
      } else {
        return 0
      }
    })
  }

  /**
   * Setup the initial sort and state when the component is about to mount
   */
  componentWillMount () {
    const { data, sortBy, sortDirection } = this.props

    data && this._sort(data, sortBy, sortDirection)

    this.setState({ data: data, sortBy: sortBy, sortDirection: sortDirection })
  }

  /**
   * Each time new props are received from the parent, sort related state needs to be updated
   */
  componentWillReceiveProps (nextProps) {
    const { sortBy, sortDirection, data } = nextProps

    // const data = this.state.data
    /**
    if (sortBy !== this.props.sortBy) {
      this._sort(data, sortBy, sortDirection)
    } else if (sortDirection !== this.props.sortDirection) {
      data.reverse()
    } */

    data && this._sort(data, sortBy, sortDirection)

    this.setState({ data: data, sortBy: sortBy, sortDirection: sortDirection })
  }

  render () {
    const data = this.state.data || []

    const selectedSystem = this.props.selectedSystem || {}

    return (
      <div className='config-grid-container'>
        <GridList cols={3}>
          {data && data.map((row, index) => (
            <GridTile rows={0.75} cols={1}
              style={styles.tile} key={row.systemName}
              onClick={() => this.props.selectSystem(row.systemName)}>
              <Paper zDepth={2}
                style={selectedSystem.systemName === row.systemName ? styles.selectedTile : styles.paper}>
                <div className='cgc-system-name'>
                  {row.systemName}
                  <span className='cgc-edit-icon'>
                    {!row.disabled &&
                      <EditMenu
                        name={row.systemName}
                        handleEdit={this.props.handleEdit}
                        handleDelete={this.props.handleDelete}
                      />
                    }
                  </span>
                </div>
                <div className='cgc-system-label'>{row.systemLabel || <br />}</div>
                <div style={{ marginTop: 10 }}>
                  <span className='cgc-date-label'>Date Added:</span>
                  <span className='cgc-date-value'>{row.dateAddedLabel}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <span className='cgc-date-label'>Last Modified:</span>
                  <span className='cgc-date-value'>{row.lastModifiedLabel}</span>
                </div>
              </Paper>
            </GridTile>
          ))}
        </GridList>
      </div>
    )
  }
}
