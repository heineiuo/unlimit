import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import {Logo} from 'react-sea/lib/Smile'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import 'react-vis/dist/style.css'
import {RadialChart} from 'react-vis'
import MessageList from './MessageList'
import commonStyles from '../styles'

class Dashboard extends Component {

  state = {
    stack: [],
    modalOpen: false
  };

  componentWillMount = () => {
  };

  requestCloseFn = () => {
    this.setState({
      modalOpen: false
    })
  };

  render () {

    const {posts, account} = this.props;

    return (
        <div>
          <div>Dashboard</div>
          <div>
            <RadialChart
              innerRadius={100}
              radius={140}
              data={[
                {angle: 2},
                {angle: 6},
                {angle: 2},
                {angle: 3},
                {angle: 1}
              ]}
              width={300}
              height={300}
            />
          </div>
        </div>
      )
  }
}

const styles = StyleSheet.create({
  ...commonStyles

});

export default connect(
  (store) => ({
    account: store.account,
    posts: store.posts,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Dashboard);
