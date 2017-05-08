import React, {Component} from 'react'
import AsyncComponent from '../components/AsyncComponent'

const Async = (props) => (
  <AsyncComponent loadKey="oauth-iframe" load={(callback) => require.ensure([], (require) => callback(null, require('./Iframe')))}>
    {(state, Auth) => (
      state < 2 ? null:
        <Auth {...props}/>
    )}
  </AsyncComponent>
);

export default Async
