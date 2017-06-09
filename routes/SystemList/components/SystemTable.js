import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import FlatButton from 'material-ui/FlatButton'
import { lightBlack } from 'material-ui/styles/colors'
import EditMenu from './EditMenu'
import './SystemTable.scss'

const styles = {
  nameButton: {
    textDecoration: 'underline',
    marginLeft: -18
  },
  nameButtonLabel: {
    textTransform: 'none'
  },
  headerLabel: {
    textTransform: 'none',
    fontWeight: 800,
    paddingLeft: 0,
    color: lightBlack
  },
  column: {
    fontSize: 14
  },
  editMenu: {
    textOverflow: 'hidden'
  }
}

export default class SystemTable extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    selectSystem: PropTypes.func.isRequired,
    selectedSystem: PropTypes.object.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: [],
    selectedSystem: {}
  }

  constructor (props) {
    super(props)

    this.state = {
      sortBy: 'systemName',
      sortDirection: 'asc',
      data: []
    }

    this._sort = this._sort.bind(this)
    this._getIcon = this._getIcon.bind(this)
    this._rowSelect = this._rowSelect.bind(this)
    this._sortData = this._sortData.bind(this)
  }

  /**
   * Function called when header is clicked.
   *
   * @param {string} sortBy
   */
  _sort (sortBy) {
    let { sortDirection, data } = this.state
    sortDirection = this.state.sortBy === sortBy && sortDirection === 'asc' ? 'desc' : 'asc'
    this._sortData(data, sortBy, sortDirection)
    this.setState({ data: data, sortBy: sortBy, sortDirection: sortDirection })
  }

  /**
   * Function to sort the given array by the field and direction.
   *
   * @param {array} data
   * @param {string} field
   * @param {string} direction
   */
  _sortData (data, field, direction) {
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
   * Function to return correct sort direction icon
   *
   * @param {string} field
   */
  _getIcon (field) {
    const { sortBy, sortDirection } = this.state

    if (sortBy !== field) {
      return
    }

    return sortDirection === 'asc' ? <ArrowUpIcon color={lightBlack} /> : <ArrowDownIcon color={lightBlack} />
  }

  _rowSelect (selectedRows) {
    const data = this.props.data || []

    selectedRows.length && this.props.selectSystem(data[selectedRows[0]].systemName)
  }

  /**
   * Setup the initial sort and state when the component is about to mount
   */
  componentWillMount () {
    const { data } = this.props

    data && this._sortData(data, this.state.sortBy, this.state.sortDirection)

    this.setState({ data: data })
  }

  /**
   * Each time new props are received from the parent, sort related state needs to be updated
   */
  componentWillReceiveProps (nextProps) {
    const { data } = nextProps

    data && this._sortData(data, this.state.sortBy, this.state.sortDirection)

    this.setState({ data: data })
  }

  render () {
    const data = this.state.data || []
    const selectedSystem = this.props.selectedSystem || {}

    return (
      <div className='system-table-container'>
        <Paper zDepth={2}>
          <div className='stc-toolbar'>
            <span className='stc-toolbar-label'>Systems</span>
            <span className='stc-toolbar-count'>{data.length} Systems</span>
          </div>
          <Table
            height={'100%'}
            fixedHeader
            fixedFooter={false}
            selectable
            onRowSelection={this._rowSelect}
          >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
                <TableHeaderColumn colSpan='2' style={{ paddingLeft: 10 }}>
                  <FlatButton
                    label='Name'
                    labelPosition='after'
                    labelStyle={styles.headerLabel}
                    icon={this._getIcon('systemName')}
                    onClick={() => this._sort('systemName')}
                  />
                </TableHeaderColumn>
                <TableHeaderColumn colSpan='3' style={{ paddingLeft: 10 }}>
                  <FlatButton
                    label='Label'
                    labelPosition='after'
                    labelStyle={styles.headerLabel}
                    icon={this._getIcon('systemLabel')}
                    onClick={() => this._sort('systemLabel')}
                  />
                </TableHeaderColumn>
                <TableHeaderColumn colSpan='2'>
                  <FlatButton
                    label='Date Added'
                    labelPosition='after'
                    labelStyle={styles.headerLabel}
                    icon={this._getIcon('dateAdded')}
                    onClick={() => this._sort('dateAdded')}
                  />
                </TableHeaderColumn>
                <TableHeaderColumn colSpan='2'>
                  <FlatButton
                    label='Last Modified'
                    labelPosition='after'
                    labelStyle={styles.headerLabel}
                    icon={this._getIcon('lastModified')}
                    onClick={() => this._sort('lastModified')}
                  />
                </TableHeaderColumn>
                <TableHeaderColumn colSpan='1' />
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              stripedRows={false}
            >
              {data.map((row, index) => (
                <TableRow key={index} selected={selectedSystem.systemName === row.systemName}>
                  <TableRowColumn colSpan='2'>
                    <FlatButton
                      label={row.systemName}
                      primary
                      style={styles.nameButton}
                      labelStyle={styles.nameButtonLabel} />
                  </TableRowColumn>
                  <TableRowColumn style={styles.column} colSpan='3'>{row.systemLabel}</TableRowColumn>
                  <TableRowColumn style={styles.column} colSpan='2'>{row.dateAddedLabel}</TableRowColumn>
                  <TableRowColumn style={styles.column} colSpan='2'>{row.lastModifiedLabel}</TableRowColumn>
                  <TableRowColumn colSpan='1' style={styles.editMenu}>
                    {!row.disabled &&
                      <EditMenu
                        name={row.systemName}
                        handleEdit={this.props.handleEdit}
                        handleDelete={this.props.handleDelete}
                      />
                    }
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}
