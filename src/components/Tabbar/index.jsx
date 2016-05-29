import React, {Component} from 'react'
import TabPane from './TabPane'
import style from './style.scss'

class Tabbar extends Component {
  state = {
    index: 0,
    cellWidth:0
  }

  componentDidMount = ()=>{
    const that = this
    const {children, activeKey} = this.props
    if (children.length>0) {
      const width = 100/children.length
      children.forEach((child, index)=> {
        if (child.key==activeKey) {
          that.setState({
            index: index,
            activeKey: activeKey,
            cellWidth: width
          })
        }
      })
    }

  }

  componentWillReceiveProps = (nextProps)=>{
    const that = this
    const {children, activeKey} = nextProps

    if (activeKey==this.state.activeKey) return false
    if (children.length>0) {
      children.forEach((child, index)=> {
        if (child.key==activeKey) {
          that.props.onSwitchKey(child.key)
          that.setState({
            activeKey: activeKey,
            index: index,
          })
        }
      })
    }

  }

  getTabPane (){
    const that = this
    const {children, activeKey} = this.props
    const {cellWidth} = this.state
    if (children.length==0) return []
    const newChildren = []
    React.Children.forEach(children, (child, index)=>{
      newChildren.push(React.cloneElement(child, {
        width: `${cellWidth}%`
      }))
    })
    return newChildren
  }

  render (){

    const {cellWidth, index} = this.state
    const underlineStyle = {
      left: `${index*cellWidth}%`,
      transition: 'all .3s ease',
      width: `${cellWidth}%`
    }

    return (
      <div
        className={style.tabbar}
        {...this.props}
      >
        {this.getTabPane()}
        <div className={style.underline}
             style={underlineStyle}></div>
      </div>
    )
  }
}

export default Tabbar
export {TabPane}