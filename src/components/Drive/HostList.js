import React, { Component } from 'react'
import { Link } from 'react-router'
import Card from 'react-sea/lib/Card'
import Button from 'react-sea/lib/Button'
import { StyleSheet, css } from 'aphrodite'
import Spin from 'react-spin'

class HostList extends Component {

  static defaultProps = {
    style: {}
  };

  state = {
    hostName: '',
    page: 1
  };

  _deleteHost = (host) => {
    console.log(host);
    this.props.deleteHost(host.hostname)
  };

  render(){
    const {style, host, closeDropdown} = this.props;
    const {hostList} = host;

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.list)}>
          <Card style={{boxShadow: 'none'}}>
            {
              host.hostListState == 2 ?
                <div className={css(styles.hostList)}>
                  {
                    hostList.map((item, index)=> (
                      <div className={css(styles.hostItem)} key={index}>
                        <Link to={`/drive/${item.hostname}`} style={{float: 'left'}} onClick={closeDropdown}>
                          <div>{item.hostname}</div>
                        </Link>
                        <div className={css(styles.buttons)} style={{float: 'left'}}>
                          <Button onClick={(e) => this._deleteHost(item)} type="danger" size="small">删除</Button>
                        </div>
                      </div>
                    ))
                  }
                </div>:
                <Spin />
            }

          </Card>
        </div>

      </div>

    )
  }
}


const styles = StyleSheet.create({
  container: {
    margin: '0 auto',
    maxWidth: 800,
    paddingTop: 20
  },

  titlebar: {
    marginBottom: 20,
    ':after': {
      clear: 'both',
      content: '',
      display: 'table'
    }
  },

  hostItem: {
    boxSizing: 'border-box',
    padding: 5,
    height: 42,
    lineHeight: '42px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between'
  }

});

export default module.exports = HostList