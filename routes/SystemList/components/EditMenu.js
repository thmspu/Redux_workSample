import React, { Component, PropTypes } from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import CopyIcon from 'material-ui/svg-icons/content/content-copy'
import CloneIcon from 'material-ui/svg-icons/av/fiber-smart-record'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { lightBlack } from 'material-ui/styles/colors'

/**
 * Component responsible for System edit, copy, clone and delete features.
 * Will be called from Table and Grid views.
 */
export default class EditMenu extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
  }

  static defaultProps = {
    name: ''
  }

  render () {
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon color={lightBlack} /></IconButton>}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        useLayerForClickAway
      >
        <MenuItem
          primaryText='Edit'
          onTouchTap={() => { this.props.handleEdit(this.props.name) }}
          rightIcon={<EditIcon />}
        />
        <MenuItem
          primaryText='Copy'
          rightIcon={<CopyIcon />}
        />
        <MenuItem
          primaryText='Clone'
          rightIcon={<CloneIcon />}
        />
        <MenuItem
          primaryText='Delete'
          onTouchTap={() => { this.props.handleDelete(this.props.name) }}
          rightIcon={<DeleteIcon />}
        />
      </IconMenu>
    )
  }
}
