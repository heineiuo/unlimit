import React, {Component} from 'react'
import AsyncComponent from './common/AsyncComponent'
import Title from './common/Title'
import {injectAsyncReducer} from '../store'

const getTitle = () => Title;


const Async = (props) => {
  return (
    <AsyncComponent load={
      (callback) => {
        //callback(require('./Master'));
        SystemJS.import('smile-admin').then(admin => {
          console.log(admin);
          callback(admin({injectAsyncReducer, getTitle}))
        });

        //require.ensure([], (require) => callback(require('./Master')))
      }
    }>
      {(Console) => {
        if (!Console) return null;
        return (
          <Console {...props}/>
        )
      }}
    </AsyncComponent>
  );
};

export default Async