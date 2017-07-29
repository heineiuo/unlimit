import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import Background from '@react-web/background'
import {Link} from 'react-router-dom'


class NotFound extends Component {

  render () {
    return (
      <div>
        <Background bgColor="#000" />
        <div className={css(styles.notFound)}>404</div>
      </div>
    )
  }
}


const styles = StyleSheet.create({

  notFound: {
    fontSize: 40,
    color: '#FFF',
    textAlign: 'center',
    marginTop: '20%'
  }


});


export default NotFound;
