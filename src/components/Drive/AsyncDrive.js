import React, {Component} from 'react'
import AsyncComponent from '../common/AsyncComponent'
import {injectAsyncReducer} from '../../store'
import host from '../../reducers/drive'
import file from '../../reducers/file'
import nav from '../../reducers/nav'

const AsyncDrive = (props) => {

  return (
    <AsyncComponent loadKey="drive" load={
      (callback) => {
        injectAsyncReducer('host', host);
        injectAsyncReducer('file', file);
        injectAsyncReducer('nav', nav);
        //callback(require('./Master'));
        require.ensure([], (require) => callback(null, require('./Drive')))
      }
    }>
      {(state, Master) => (
        state < 2 ? null: <Master {...props}/>
      )}
    </AsyncComponent>
  );
};

export default AsyncDrive