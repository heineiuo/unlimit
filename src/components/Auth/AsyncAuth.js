import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import AsyncComponent from '../common/AsyncComponent'
import {getPostList} from '../../store/feed/postList'

const Async = (props) => (
  <AsyncComponent load={(callback) => require.ensure([], (require) => callback(null, require('./index')))}>
    {(state, Auth) => (
      state < 2 ? null:
        <Auth {...props}/>
    )}
  </AsyncComponent>
);

export default Async