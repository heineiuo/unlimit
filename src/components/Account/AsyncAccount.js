import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import AsyncComponent from '../common/AsyncComponent'
import {getPostList} from '../../store/feed/postList'

const Async = (props) => (
  <AsyncComponent load={(callback) => require.ensure([], (require) => callback(require('./Check')))}>
    {(Account) => {
      if (!Account) return null;
      return <Account {...props}/>
    }}
  </AsyncComponent>
);

export default Async