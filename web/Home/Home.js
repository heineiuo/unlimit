import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import Body from '@react-web/body'
import DropDown, {DropDownTrigger, DropDownContent} from '@react-web/dropdown'
import Logo from '../components/smile'
import Background from '@react-web/background'
import {Link} from 'react-router-dom'
import Particle from '../components/Particle'
import Title from '../components/Title'
import ProfileDropDown from '../components/ProfileDropDown'
import MessageList from './MessageList'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import commonStyles from '../components/styles'

class Home extends Component {

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

    const {postList, account} = this.props;

    return  (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />
        <Background bgColor="#efeff4" />
        
        <div className={css(styles.globalHeaderBar)}>
          <div style={{display: 'flex'}}>
            <Title color='#FFFFFF' title="首页" style={{textDecoration: 'none', marginRight: 10}}/>
          </div>
        </div>
        <div style={{marginTop: 50}}>
          {
            account.logged ? 
              <MessageList postList={[]} />:
              <div>welcome</div>
          }
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
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Home);
