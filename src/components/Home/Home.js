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
import {getPostList} from '../../store/feed/postList'

class Home extends Component {

  state = {
    stack: [],
    modalOpen: false
  };

  componentWillMount = () => {
    this.props.getPostList()
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
          <div className={css(styles.headerBar)}>
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

          <MessageList postList={postList} />
        </div>
      )
  }
}



const styles = StyleSheet.create({

  headerBar: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    height: 56,
    // borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#FFF',
    padding: '0 20px',
    lineHeight: `${56}px`,
    marginBottom: 10,
  },

});


export default module.exports = connect(
  (store) => ({
    account: store.account,
    postList: store.postList,
  }),
  (dispatch) => bindActionCreators({
    getPostList
  }, dispatch)
)(Home);
