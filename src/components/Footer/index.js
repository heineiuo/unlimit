import {Component} from 'react'

class UserBar extends Component {
  render(){
    return (


      <div className="footer">

        <div className="text-center">
          <span style={{margin: '0 10px'}}>{new Date().getYear()+1900}</span>
          <a target="_blank" href="http://www.youkuohao.com">右括号工作室</a>
        </div>

      </div>


    )
  }
}

export default UserBar