import React, {Component} from 'react'
import AsyncComponent from '../common/AsyncComponent'

const Async = (props) => (
  <AsyncComponent load={(callback) => require.ensure([], (require) => callback(null, require('./Check')))}>
    {(state, Account) => (
      state < 2 ? null: <Account {...props}/>
    )}
  </AsyncComponent>
);

export default Async