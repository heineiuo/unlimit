import {StyleSheet} from 'aphrodite'

export default StyleSheet.create({
  buttonWrapper: {
    display: 'inline-block'
  },

  button: {
    background: '#fbfbfb',
    color: '#888',
    fontSize: '18px',
    border: 0,
    paddingTop: '5px',
    verticalAlign: 'bottom',
    height: '34px',
    width: '36px',

    ':hover': {
      background: '#f3f3f3',
      outline: 0
    },
    ':focus': {
      background: '#f3f3f3',
      outline: 0
    }
  },
  button_active: {
    background: '#efefef',
    color: '#444'
  }
})