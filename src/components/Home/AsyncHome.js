import React, {Component} from 'react'
import AsyncComponent from '../common/AsyncComponent'

const AsyncHome = (props) => (
  <AsyncComponent load={(callback) => require.ensure([], (require) => callback(require('./Home')))}>
    {(Home) => {
      if (!Home) return null;
      return <Home {...props}/>
    }}
  </AsyncComponent>
);

export default AsyncHome