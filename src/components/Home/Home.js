import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import Body from 'react-sea/lib/Body'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import {Logo} from 'react-sea/lib/Smile'
import Background from 'react-sea/lib/Background'
import {Link} from 'react-router-dom'
import Particle from '../common/Particle'
import Title from '../common/Title'
import ProfileDropDown from '../common/ProfileDropDown'
import MessageList from './MessageList'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import commonStyles from '../common/styles'

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

    return !account.logged?<Particle />:
      (
        <div>
          <Body style={{margin: 0, backgroundColor: '#efeff4'}} />
          <Background bgColor="#efeff4" />
          <div className={css(styles.globalHeaderBar)}>
            {/*<div style={{padding: '0 20px', display: 'flex'}}>*/}
              {/*<Link to="/" style={{display: 'flex', textDecoration: 'none'}}>*/}
                {/*<Logo color="#f56455"/>*/}
                {/*<span style={{color: '#f56455'}}>右括号</span>*/}
              {/*</Link>*/}
            {/*</div>*/}
            <Title color="#f56455" title="右括号" style={{textDecoration: 'none', marginRight: 10}}/>
            <div>
            </div>
            <ProfileDropDown />
          </div>
          <MessageList postList={[]} />
          <div>

          </div>
        </div>
      )
  }
}



const styles = StyleSheet.create({
  ...commonStyles

});


export default module.exports = connect(
  (store) => ({
    account: store.account,
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Home);
