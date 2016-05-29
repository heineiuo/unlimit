import React, {Component} from 'react'
import {Link} from 'react-router'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as HostActions from '../../dataflow/actions/host'

class File extends Component {

  render (){

    return (
      <div className="container width-max" style="padding-top: 20px">

        <div className="paper">

          <div className="title clearfix">
            <div className="pull-left">路径:</div>
            <ul className="pathbar pull-left clearfix">
              {/*
          var result  = path.split('/');
          console.log(result);
          var pathes = _.clone(result);
          _.map(result, function(item, index){
              if (index>0){
              if (item!='') {
              item=result[index]=result[index-1]+'/'+item;
              } else {
              return false
            }
          }
        %}
              <li>
                <a href="{{conf.hrefPrefix}}/file?path={{item==''?'/':item}}">{{pathes[index]==''?'/':pathes[index]}}</a>
              </li>
              {%
          })
          */}
            </ul>
            <div className="pull-right">

              <button className="btn btn-sm btn-primary fileinput-button"  id="imageupload" style="overflow: hidden;position: relative">
                <span>上传文件</span>
                <input type="file" name="file" className="input-file" />
              </button>

              <div className="upload-bar">

                <div className="upload-fail"></div>
                <div className="upload-progress">
                  <div className="progress-bar"></div>
                </div>
              </div>

            </div>
          </div>

          <div id="files-container"></div>

        </div>

      </div>
    )

  }

}

export default File
