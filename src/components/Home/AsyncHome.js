import React, {Component} from 'react'
import AsyncComponent from '../common/AsyncComponent'

const AsyncHome = (props) => (
  <AsyncComponent load={(callback) => require.ensure([], (require) => callback(null, require('./Home')))}>
    {(state, Home) => (
      state < 2 ? null:
        <Home {...props}/>
    )}
  </AsyncComponent>
);

export default AsyncHome