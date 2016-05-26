class Home extends Component {

  render (){
    return (
      <div class="container width-max" style="padding-top: 20px;;">

        <div class="row">
          <div class="col-sm-6">

            <div class="paper" style="margin-bottom: 20px;">
              <a href="{{conf.hrefPrefix}}/host">域名管理</a>
            </div>

          </div>

          <div class="col-sm-6">

            <div class="paper" style="margin-bottom: 20px;">
              <a href="{{conf.hrefPrefix}}/file">文件管理</a>
            </div>
          </div>

          <div class="col-sm-6">

            <div class="paper" style="margin-bottom: 20px;">
              <a href="{{conf.hrefPrefix}}/process">进程管理</a>
            </div>
          </div>

          <div class="col-sm-6" style="margin-bottom: 20px;">

            <div class="paper">
              <a href="{{conf.hrefPrefix}}/cli">命令行工具</a>
            </div>
          </div>
        </div>



      </div>
    )
  }
  
}