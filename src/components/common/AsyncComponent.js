import React, {Component} from 'react'

class AsyncComponent extends Component {

  state = {
    loadState: 0,
    // short for "module" but that's a keyword in js, so "mod"
    mod: null
  };

  componentWillMount() {
    this.load(this.props)
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.loadKey !== this.props.loadKey) {
      this.load(nextProps)
    }
  };

  load(props) {
    this.setState({
      loadState: 1,
      mod: null
    });
    props.load((e, mod) => {
      if (e) {
        return this.setState({
          loadState: 3
        })
      }
      this.setState({
        loadState: 2,
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render(){
    return this.props.children(this.state.loadState, this.state.mod)
  }
}

export default module.exports = AsyncComponent