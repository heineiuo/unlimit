import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import Body from '@react-web/body'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import Background from '@react-web/background'
import {Link} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ProfileDropDown from './account/ProfileDropDown'
import MessageList from './message/MessageList'
import commonStyles from './common/styles'
import {RadialChart} from 'react-vis'
import 'react-vis/dist/style.css'

class Home extends Component {

  static defaultProps = {
    color: '#666',
    style: {},
    title: "右括号"
  };

  closeContent = () => {
    this.dropDown.toggle(false)
  };

  requestCloseFn = () => {
    this.setState({
      modalOpen: false
    })
  };

  state = {
    stack: [],
    modalOpen: false
  };

  componentWillMount = () => {
  };

  render () {

    const {postList, account} = this.props;

    return  (
      <div style={{marginTop: 50}}>
      
        {
          account.logged ? 
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
              <MessageList postList={[]} />
            </div>:
            <div>welcome</div>
        }
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
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Home);
