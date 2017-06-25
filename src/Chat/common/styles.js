import {StyleSheet} from 'aphrodite/no-important'

export const btn = StyleSheet.create({
  normal: {
    cursor: 'pointer',
    backgroundColor: '#EEE',
    borderBottom: '2px solid rgba(0,0,0,0.2)',
    color: '#FFF',
    padding: '0 15px',
    height: 30,
    textAlign: 'center',
    boxSizing: 'border-box',
    borderRadius: 4,
    fontSize: 14,
    lineHeight: '30px'
  },

  md: {
    cursor: 'pointer',
    backgroundColor: '#EEE',
    color: '#FFF',
    padding: '0 15px',
    height: 25,
    textAlign: 'center',
    boxSizing: 'border-box',
    lineHeight: '25px',
    boxShadow: '0 1px 3px #999'
  }
});