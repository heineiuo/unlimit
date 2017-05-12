import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'
import {Route, Switch, Link} from 'react-router-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import hoverHoc from '../components/hoverHoc'
import commonStyle from '../styles/index'
import tableViewStyle from '../styles/tableView'

const TableRow = hoverHoc(props => (
  <Link to={`${props.path}/${props.item._id}`} className={css(styles.link)}>
    <div className={css(styles.tableView__line, props.hovered && styles.tableView__line_hover)}>
      <div className={css(styles.tableView__cell)}>{props.item.title}</div>
      <div className={css(styles.tableView__cell)}>{props.item.tags}</div>
      <div
        onClick={props.onClickStatus}
        className={css(styles.tableView__cell)}>{['草稿', '已发布'][props.item.status]}</div>
    </div>
  </Link>
))

class Posts extends Component {

  onClickStatus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('pppp')
  }

  changeSearchText = (e) => this.setState({searchText: e.target.value});

  state = {
    searchText: '',
  }

  componentDidMount = () => {
    const {match: {params: {driveId}}} = this.props;
    console.log('this.props.getPosts(driveId)')
    this.props.getPosts(driveId)
  }

  render (){
    const {match, posts} = this.props;
    return (
      <Switch>
        <Route path={match.path} exact>
          <div>
            <div style={{padding: 20}}>文章列表</div>
            <div style={{padding: 20, maxWidth: 800, width: '100%'}}>
              <div style={{display: 'flex'}}>
                <Input 
                  type="text" 
                  placeholder="搜索" 
                  value={this.state.searchText} 
                  className={css(styles.searchInput)}
                  onChange={this.changeSearchText}/>
                <Button>搜索</Button>
              </div>

              <div className={css(styles.filterBar)}>
                <div style={{display: 'flex'}}>
                  <div>筛选</div>
                </div>
              </div>
              <div className={css(styles.tableView)}>
                <div className={css(styles.tableView__header)}>
                  <div className={css(styles.tableView__cell, styles.tableView__cell_bold)}>标题</div>
                  <div className={css(styles.tableView__cell, styles.tableView__cell_bold)}>标签</div>
                  <div className={css(styles.tableView__cell, styles.tableView__cell_bold)}>状态</div>
                </div>
                <div className={css(styles.tableView__body)}>
                  {posts.list.map(item => (
                    <TableRow 
                      key={item._id}
                      path={match.path}
                      onClickStatus={this.onClickStatus}
                      style={{flex: 1}} 
                      item={item}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Route>
        <Route path={`${match.path}/:id`}>
          <div>detail </div>
        </Route>
      </Switch>
      
    )
  }
}

const styles = StyleSheet.create({
  ...commonStyle,
  ...tableViewStyle,
  searchInput: {
    width: 300,
  },
  filterBar: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },
  
})

export default connect(
  store => ({
    account: store.account,
    posts: store.posts
  }),
  dispatch => bindActionCreators({
    getPosts: require('../actions/posts/getPosts').default
  }, dispatch)
)(Posts)
