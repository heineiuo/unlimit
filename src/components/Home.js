import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite/no-important'
import Body from 'react-sea/lib/Body'
import DropDown, {DropDownTrigger, DropDownContent} from 'react-sea/lib/DropDown'
import {Logo} from 'react-sea/lib/Smile'
import Background from 'react-sea/lib/Background'
import {Link} from 'react-router'
import Particle from './Particle'
import Title from './Title'

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
            <div style={{padding: '12px 20px 0', display: 'flex'}}>
              {/*<Link className={css(styles.navItem)} to="/post">写文章</Link>*/}
              <Link className={css(styles.navItem)} to="/drive">空间</Link>
              <DropDown className={css(styles.navItem)}>
                <DropDownTrigger>
                  <div className={css(styles.avatar)}>我</div>
                </DropDownTrigger>
                <DropDownContent>
                  <Link to="/account">账号</Link>
                </DropDownContent>
              </DropDown>
            </div>
          </div>

          <div style={{paddingTop: 76, margin: '0 auto', width: '100%', maxWidth: 1000}}>
            {
              postList.list.map(item => (
                <div key={item._key} className={css(styles.item)}>
                  <Link to={`/post/${item._key}`}>
                    <div>
                      <div className="title">{item.title}</div>
                      <div>{String(new Date(item.time||Date.now()))}</div>
                    </div>
                  </Link>
                </div>
              ))
            }
          </div>
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

  navItem: {
    padding: '0 12px',
    textDecoration: 'none',
    lineHeight: `${32}px`,
    color: 'rgba(103,103,139,.8)'
  },

  navItem_active: {
    color: '#1185fe'
  },

  avatar: {
    borderRadius: 20,
    width: 32,
    height: 32,
    backgroundColor: '#83121a',
    lineHeight: `${32}px`,
    textAlign: 'center',
    color: '#FFF'
  },

  item: {
    backgroundColor: '#FFF',
    minHeight: 80,
    borderBottom: '1px solid #D9D9D9'
  }


});


export default Home;
