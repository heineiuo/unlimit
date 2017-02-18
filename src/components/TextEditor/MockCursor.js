import React, {Component} from 'react'
import { StyleSheet, css } from 'aphrodite/no-important'

class MockCursor extends Component {


  render (){

    return (
      <div></div>
    )
  }
}


const styles = StyleSheet.create({
  editor: {
    display: 'flex',
    // justifyContent: 'space-between',
    flexDirection: 'row',
  }
});


export default MockCursor
