import React, {Component} from "react"
import {TabBar, TabPane} from "react-sea/lib/Tabbar"
import Input from "react-sea/lib/Input"
import Button from "react-sea/lib/Button"
import Checkbox from "react-sea/lib/Checkbox"
import {StyleSheet, css} from "aphrodite"

class LocationDetail extends Component {

  static defaultProps = {
    onChange: () => {}
  };

  changeState = (changePart) => {
    this.props.onChange(changePart);
  };

  bodyTypes = ['HTML', 'JSON', 'API', 'PROXY', 'SEASHELL', 'REDIRECT', 'FILE'];

  render() {
    const {isOpen, pathname, content, cors, type} = this.props;
    if (!isOpen) return null;
    return (
      <div className={css(styles.detail)}>
        <div className="formGroup row">
          {/*路由匹配*/}
          <div className="col-xs-12">
            <Input
              label={'路由'}
              noBorder={true}
              inlineGroup={true}
              value={pathname}
              onChange={(e) => {this.changeState({pathname: e.target.value})}}
              type="text"
              placeholder="请输入正则表达式"/>
          </div>
          {/*跨域*/}
          <div className="form-group row">
            <div className="col-xs-12">
              <label>跨域</label>
              <Checkbox
                label="是"
                checked={cors}
                onChange={(e)=>{this.changeState({cors: e.target.value})}}/>
            </div>
          </div>
          {/*类型*/}
          <div className="form-group">
            <label>类型</label>
            <div style={{width: '100%', height: 50, position: 'relative'}}>
              <TabBar
                activeKey={type.toUpperCase()}
                onSwitchKey={(key) => this.changeState({type: key})}>
                {
                  this.bodyTypes.map(type => (
                    <TabPane key={type}>{type}</TabPane>
                  ))
                }
              </TabBar>
            </div>
            <div className="tab-content">
              <label>{type}</label>
              <div>
                <Input
                  type="text"
                  onChange={(e)=>{this.changeState({content: e.target.value})}}
                  value={content}
                  name="content"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  detail: {
    width: '100%',
  }
});


export default LocationDetail