import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Manage from './Manage'

class CMS extends Component {

  render () {
    const {match} = this.props;
    console.log(match.path)
    return (
      <Switch>
        <Route path={`${match.path}`} exact>
          <div>cms manage~~~</div>
        </Route>
        <Route path={`${match.path}/:driveId`} component={Manage}/>
      </Switch>
    )
  }
}

export default CMS
