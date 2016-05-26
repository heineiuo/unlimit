import React, {Component} from 'react'
import {Link} from 'react-router'

class HostNew extends Component {
  render(){
    return (
      <div>

        <!--新建一个location-->
        <div className="container width-max" style="padding-top: 20px;">

          <div className="paper">

            <div className="title">
              <h4 className="">
                添加一个域名
              </h4>
            </div>

            <div className="host-new-wrap">

              <div className="form form-horizontal">

                <div className="form-group">
                  <label className="control-label col-sm-2" for="input-hostname">域名</label>
                  <div className="col-sm-4">
                    <input className="form-control" name="hostname" id="input-hostname" type="text" placeholder="请输入域名"  />
                  </div>
                </div>


                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-4 form-error"></div>
                </div>


                <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-4">
                    <button className="btn btn-submit btn-primary btn-block">提交</button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>


      </div>

    )
  }
}

export default HostNew