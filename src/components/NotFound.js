import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import Background from 'react-sea/lib/Background'
import {Link} from 'react-router-dom'


class NotFound extends Component {

  render () {
    return (
      <div>
        <Background bgColor="#666" />
        <div>404</div>
      </div>
    )
  }
}



const styles = StyleSheet.create({

  notFound: {

  }


});


export default module.exports = NotFound;
