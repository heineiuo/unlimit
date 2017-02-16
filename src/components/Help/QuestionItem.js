import React, {Component} from 'react'

class QuestionItem extends Component {
  render () {
    return (
      <div name={this.props.title}>
        <div>{this.props.title}</div>
        <div>{this.props.description}</div>
      </div>
    )
  }
}

export default QuestionItem

