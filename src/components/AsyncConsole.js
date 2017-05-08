import React, {Component} from 'react'
import AsyncComponent from './AsyncComponent'
import Title from './Title'
import {injectAsyncReducer} from '../store'

const getTitle = () => Title;


const Async = (props) => {
  return (
    <AsyncComponent loadKey="admin" load={
      (callback) => {
        //callback(require('./Master'));
        //require.ensure([], (require) => callback(require('./Master')))
        SystemJS.import('smile-admin').then(admin => {
          const Admin = admin({injectAsyncReducer});
          callback(null, Admin)
        }).catch(e => callback(e));
      }
    }>
      {(state, Console) => (
        state < 2 ? null:
          state === 3 ? <div>加载控制台出错</div>:
            <Console {...props} getTitle={getTitle} />
      )}
    </AsyncComponent>
  );
};

export default Async
