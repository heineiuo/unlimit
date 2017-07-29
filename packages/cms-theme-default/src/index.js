import React, {Component} from 'react'
import Body from '@react-web/body'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {StyleSheet, css} from 'aphrodite'
import {HashRouter, Switch, Route, Link} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Carousel from './Carousel'
import FooterShows from './FooterShows'
import commonStyle from './styles'
import Home from './Home'
import Page from './Page'
import Tag from './Tag'
import PostDetail from './PostDetail'
import SideLeft from './SideLeft'

class Demo extends Component {

  render () {
    const {
      queryPostDetail,
      getPostList
    } = this.props

    const managePath = '/manage';
    const {Manage} = this.props;

    return (
      <HashRouter>
        <Switch>
          <Route path={managePath} component={Manage} />
          <Route>
            <div>
              <Body ref={body => this.body = body} />
              <div style={{minHeight: '100%', paddingBottom: 52}}>
                <Header />
                <Carousel />
                <div>
                  <div className={css(styles.container)}>
                    <Switch>
                      <Route path="/" exact component={Home}/>
                      <Route>
                        <div className={css(styles.row)}>
                        <div className={css(styles.col3)}>
                          <SideLeft />
                        </div>
                        <div className={css(styles.col9)}>
                          <Switch>
                            <Route path="/page/:pageName" >
                             {
                                props => <Page {...props} queryPostDetail={queryPostDetail} />
                              }
                            </Route>
                            <Route path="/tag/:tagName" >
                              {
                                props => <Tag  
                                  {...props}
                                  getPostList={getPostList}
                                  queryPostDetail={queryPostDetail} />
                              }
                            </Route>
                            <Route path="/post/:postId" component={PostDetail} />
                          </Switch>
                        </div>
                      </div>
                      </Route>
                    </Switch>
                  </div>
                  <FooterShows />
                </div>
              </div>
              <Footer />
            </div>
          </Route>
        </Switch>
      </HashRouter>
    )
  }
}

const styles = StyleSheet.create({

  ...commonStyle,
  header: {
    height: 340,
    backgroundImage: 'linear-gradient(70deg, #bc94d8, #92d8f1)'
  },

});

export default connect(
  (store) => ({
    account: store.account,
    posts: store.posts
  }),
  (dispatch) => bindActionCreators({
  }, dispatch)
)(Demo);
