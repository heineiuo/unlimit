import React, {Component} from 'react'
import QuestionItem from './QuestionItem'

/*
 * TabItem
 * */
class QuestionApp extends  Component {
  render () {
   const {questions} = this.props
    console.log(questions)
    const questionComps = questions.map((qst) => {
      return (
        <QuestionItem
          title={qst.title}
          key={qst.key}
          description={qst.description}
        />
      )
    })
    return (
      <div>
        {questionComps}
      </div>
    )
  }
}


export default QuestionApp

