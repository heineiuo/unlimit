import React, {Component} from 'react'
import {Link} from 'react-router'
import Header from './Header'
import Body from 'react-sea/lib/Body'
import {StyleSheet, css} from 'aphrodite'

class Master extends Component {

  state = {
    showBg: false
  };

  // handleWheel = () => {
  //   this.updateBg()
  // };

  // updateBg = () => {
  //   const showBg = document.body.scrollTop > 0;
  //   if (this.state.showBg != showBg) {
  //     this.setState({
  //       showBg: showBg
  //     })
  //   }
  // };

  componentWillMount = () => {
    const {getHostList, params, host} = this.props;
    if (host.hostListState == 0) getHostList(params.hostname);
  };

  componentWillUnmount = () => {
    console.error('unmounting drive master')
  };

  // componentDidUpdate = () => {
  //   this.updateBg()
  // };

  render(){
    const { account, children, nav, createHost, host, getHostList, deleteHost} = this.props;

    return (
      <div>
        <Body style={{margin: 0, backgroundColor: '#efeff4'}} />

        {
          account.loginCheckState < 2?
            <div>loading</div>:
            !account.logged?
              <div>
                <Link to="/account">登录</Link>
              </div>:
              <div
                className={css(styles.container)}
               // onWheel={this.handleWheel}
              >
                <Header
                  host={host}
                  getHostList={getHostList}
                  deleteHost={deleteHost}
                  nav={nav}
                  createHost={createHost}/>
                {children}
              </div>
        }
      </div>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50
  }
});

export default module.exports = Master