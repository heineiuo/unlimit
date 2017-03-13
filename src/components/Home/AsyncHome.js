import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import AsyncComponent from '../common/AsyncComponent'
import {getPostList} from '../../store/feed/postList'

const AsyncHome = () => (
    <AsyncComponent load={(callback) => require.ensure([], (require) => callback(require('./Home')))}>
      {(component) => {
        if (!component) return null;
        return React.createElement(
          connect(
            (store) => ({
              account: store.account,
              postList: store.postList,
            }),
            (dispatch) => bindActionCreators({
              getPostList
            }, dispatch)
          )(component)
        )
      }}
    </AsyncComponent>
  )

export default AsyncHome