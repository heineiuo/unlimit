import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import Background from 'react-sea/lib/Background'
import {Link} from 'react-router-dom'


class NotFound extends Component {

  render () {
    return (
      <div>
        <Background bgColor="#000" />
        <div style={{fontSize: 40, color: '#FFF', textAlign: 'center', marginTop: '20%'}}>404</div>
      </div>
    )
  }
}



const styles = StyleSheet.create({

  notFound: {

  }


});


export default module.exports = NotFound;
