import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import QuestionApp from './QuestionApp'


class Help extends  Component {


  static defaultProps = {
    handleSubmit: () => {}
  };

  _handleSubmit = () => {
    const {getQuestion, account} = this.props
    getQuestion()
  };

  /*初始化执行后台数据（主动） mount执行action函数*/
  // componentWillMount = () =>  {
  //    const {actions, account} = this.props
  //   actions.getQuestion()
  // }


  render() {
      const {getQuestion, account} = this.props
      return (
        <div>
          <QuestionApp
            questions={account.questions}
            handleSubmit={getQuestion}
          />
          <div onClick={this._handleSubmit}>点击更新内容</div>
        </div>
      )
    }
}



export default module.exports = connect(
  (store) => ({
    account: store.account
  }),
  (dispatch) => bindActionCreators({
    getQuestion: () => async (dispatch, getState) => {
      try {
        const result = await TREEAPI.getQuestion()
        dispatch({
          type: 'HELP_QUESTION',
          questions:result.questions,
          payload: {
            title:result.title,
            key: result.key,
            description:result.description
          }
        })

      } catch(e){
        console.log(e)
      }
    }
  }, dispatch)
)(Help)
