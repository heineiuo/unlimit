import React, {Component} from 'react'

export default function (Fn) {
  return class Hover extends Component {

  _mouseenter = () => this.setState({hovered: true})
  _mouseleave = () => this.setState({hovered: false})
  componentDidMount () {
      this.child.addEventListener('mouseenter', this._mouseenter, false)
      this.child.addEventListener('mouseleave', this._mouseleave, false)
    }

    componentWillUnmount () {
      this.child.removeEventListener('moudeenter', this._mouseenter, false)
      this.child.removeEventListener('moudeleave', this._mouseleave, false)
    }

    render(){
      const props = Object.assign({}, this.state, this.props)
      return (
        <div ref={ref => this.child = ref}>
          <Fn {...props} />
        </div>
      )
    }
  }
}
