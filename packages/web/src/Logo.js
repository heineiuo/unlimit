import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'

class Logo extends Component {
  render (){
    return (
      <div className={css(styles.logo)} style={{margin: '0 auto'}}>
        <div className={css(styles.logo__rect)}>
          <div className={css(styles.logo__eyes)} />
          <div className={css(styles.logo__mouth)} />
        </div>
      </div>
    )
  }
}


const styles = StyleSheet.create({

  logo: {
    backgroundColor: '#FFD440',
    width: 80,
    height: 80,
    borderRadius: '80px',
    lineHeight: '80px',
    textAlign: 'center',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'scale(1.5)'
  },

  logo__rect: {
    position: 'relative',
    boxSizing: 'border-box',
    width: 32,
    height: 32,
    display: 'inline-block',
    lineHeight: '28px',
    textAlign: 'center',
    color: 'rgb(255, 212, 64)',
    borderRadius: 8,
    border: '1px solid rgb(255, 255, 255)',
    backgroundColor: '#FFF',
    transform: 'scale(1.5)',
    boxShadow: '1px 1px 0 #ff9cc5, 2px 1px 0 #beabf9',
  },

  logo__eyes: {
    ":after": {
      content: '":"',
      fontSize: '16px',
      fontWeight: 'bold',
      position: 'absolute',
      top: '0px',
      right: '0px',
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      paddingRight: '43%',
    }
    
  },

  logo__mouth: {
    ":after": {
      content: '")"',
      fontSize: '20px',
      position: 'absolute',
      top: '0px',
      right: '0px',
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      paddingLeft: '27%',
      lineHeight: '32px',
    }
    
  }
})

export default Logo
