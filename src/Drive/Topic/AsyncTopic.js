import React, {Component} from 'react'
import AsyncComponent from '../../components/AsyncComponent'
import {injectAsyncReducer} from '@react-shared/ootb-store'


const Async = (props) => {
  return (
    <AsyncComponent load={
      (callback) => {
        //callback(require('./Master'));
        //require.ensure([], (require) => callback(require('./Master')))
        SystemJS.import('drive-topic').then(admin => {
          const Admin = admin({injectAsyncReducer});
          callback(null, Admin)
        }).catch(e => callback(e));
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
