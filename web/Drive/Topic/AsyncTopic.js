import React, {Component} from 'react'
import AsyncComponent from '../../components/AsyncComponent'
import {injectAsyncReducer} from '../../store'


const Async = (props) => {
  return (
    <AsyncComponent load={
      (callback) => {
        require.ensure([], (require) => {
          const Topic = require('./Topic').default
          callback(null, Topic)
        })
      }
    }>
      {(state, Topic) => (
        state < 2 ? null:
          state === 3 ? <div>加载Topic模块出错</div>:
            <Topic {...props} />
      )}
    </AsyncComponent>
  );
};

export default Async
