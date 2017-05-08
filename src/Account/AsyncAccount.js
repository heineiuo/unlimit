import React, {Component} from 'react'
import AsyncComponent from '../components/AsyncComponent'

const Async = (props) => (
  <AsyncComponent loadKey="account" load={(callback) => require.ensure([], (require) => callback(null, require('./Account')))}>
    {(state, Account) => (
      state < 2 ? null: <Account {...props}/>
    )}
  </AsyncComponent>
);

export default Async
