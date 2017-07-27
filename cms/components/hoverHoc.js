import React, {Component} from 'react'

export default function (Fn) {
  class Hover extends Component {

    static defaultProps = {
      className: '',
      style: {}
    }

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
      const {className, style, TagName} = this.props;
      const props = Object.assign({}, this.state, this.props)
      return (
        <div ref={ref => this.child = ref} {...{className, style}}>
          <Fn {...props} />
        </div>
      )
    }
  }

  return Hover
}
