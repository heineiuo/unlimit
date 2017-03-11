import React, {Component, PropTypes} from 'react'
import Paper from 'react-sea/lib/Paper'
import { Link } from 'react-router'
import Spin from 'react-spin'
import {TabBar, TabPane} from 'react-sea/lib/Tabbar'
import {css, StyleSheet} from 'aphrodite/no-important'

class HostWrapper extends Component {

  state = {
    activeTab: 'file'
  };

  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount = () => {
    const {params, location: {pathname}} = this.props;

    const activeTab = pathname.search('/file')>0?'file':
      pathname.search('/location')>0?'location':
      pathname.search('/setting')>0?'setting':'file';

    this.setState({
      activeTab
    })
  };

  handleSwitchKey = (activeTab) => {
    const {params} = this.props;
    this.context.router.push(`/drive/${params.hostname}/${activeTab}`);
    this.setState({activeTab});
  };

  render (){
    const {children, host, params} = this.props;
    console.log(host.hostListState);

    return (
      <div className={css(styles.wrapper)}>
        <Paper style={{boxShadow: 'none', padding: 0}} >
          <div className={css(styles.wrapper__header)}>
            <div>{params.hostname}</div>
            <div style={{position: 'relative', height: 40, width: 320}}>
              <TabBar
                style={{}}
                underlineStyle={{borderBottomWidth: 2}}
                activeKey={this.state.activeTab}
                onSwitchKey={this.handleSwitchKey}>
                <TabPane key="file" style={styles.tabPane._definition}>文件</TabPane>
                <TabPane key="location" style={styles.tabPane._definition}>路由</TabPane>
                <TabPane key="setting" style={styles.tabPane._definition}>设置</TabPane>
              </TabBar>
            </div>
          </div>
          <div className={css(styles.wrapper__body)}>
            {host.hostListState < 2?<Spin />: children}
          </div>
        </Paper>
      </div>
    )
  }

}

const styles = StyleSheet.create({
  wrapper: {
    margin: '0 auto',
    maxWidth: 1000,
    paddingTop: 20,
  },

  wrapper__header: {
    backgroundColor: '#FFF',
    borderBottom: '1px solid #EFEFF9',
    padding: '20px 20px 0',
  },

  wrapper__body: {
    padding: 20,
  },

  tabPane: {
    fontSize: 14,
    lineHeight: '28px',
    letterSpacing: 4
  }
});

export default module.exports = HostWrapper

