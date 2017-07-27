import React, {Component} from 'react'
import {StyleSheet, css} from 'aphrodite'
import {Link} from 'react-router-dom'
import commonStyle from './styles'

class Footer extends Component {

  render () {

    return (

      <div //className="container-fluid"
        className={css(styles.footer)} >
        <div className={css(styles.row)}>
          <div className={css(styles.copyright)}>
            xxx
          </div>
        </div>

      </div>
    )
  }
}

const styles = StyleSheet.create({
  ...commonStyle,

  footer: {

    marginTop: -52,
    minHeight: 52,
    backgroundColor: '#669f36'
  },

  copyright: {
    flex: 1,
    marginTop: 20,
    color: '#fff',
    textAlign: 'center'
  }

});

export default Footer
