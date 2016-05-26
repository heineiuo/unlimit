class SideBar extends Component {

  render(){

    var pathname = pathname || req.pathname;

    var matchPath = function (path, result){
      var result = result||'active';
      return pathname.match(path)?result:'';
    };


    return (
        <ul className="nav nav-list">
          <li className="{{matchPath(/^\/$/, 'active', 1)}}">
            <a className="menu-text link" href="{{conf.hrefPrefix}}/">控制台</a>
          </li>

          <li className="{{matchPath('/app')}}">
            <a href="{{conf.hrefPrefix}}/app" className="menu-text">应用中心</a>
          </li>

          <li className="{{matchPath('/host')}}">
            <a href="{{conf.hrefPrefix}}/host" className="menu-text">网站中心</a>

          </li>

          <li className="{{matchPath('/location')}}">
            <a href="{{conf.hrefPrefix}}/location" className="menu-text">网页(移至网页中心)</a>
          </li>


          <!--<li className="{{matchPath('/doc')}}">-->
      <!--<span className="menu-text link">文档</span>-->
      <!--<ul className="submenu nav {{matchPath('/doc', 'open')}}">-->
      <!--<li className="{{matchPath('/doc/api')}}">-->
      <!--<a className="link" href="{{conf.hrefPrefix}}/doc/api">申请</a>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</li>-->

        </ul>


  )
  }
}