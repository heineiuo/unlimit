import React, {Component} from 'react'
import Loader from '@react-web/async-loader'
import {injectAsyncReducer} from '@react-web/store'


const Async = (props) => {
  return (
    <Loader 
      loadKey={'topic'}
      load={cb => require.ensure([], 
        require => callback(null, require('./Topic').default)
      )}
    />
  );
};

export default Async
