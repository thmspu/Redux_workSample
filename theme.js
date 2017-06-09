import { lightBlue700, lightBlue800, lightBlue900,
        yellowA700, darkBlack, white } from 'material-ui/styles/colors'

const palette = {
  primary1Color: lightBlue700,
  primary2Color: lightBlue800,
  primary3Color: lightBlue900,
  accent1Color: yellowA700,
  accent2Color: yellowA700,
  accentYellow: yellowA700,
  textColor: darkBlack
}

const theme = {
  palette,
  fontFamily: 'Source Sans Pro, sans-serif',
  textField: {
    focusColor: palette.accent1Color
  },
  checkbox: {
    checkedColor: palette.accent1Color,
    requiredColor: palette.accent1Color
  },
  raisedButton: {
    primaryColor: palette.primary1Color,
    primaryTextColor: white
  },
  toolbar: {
    iconColor: darkBlack,
    backgroundColor: 'transparent'
  }
}

/** @private */
export default theme
