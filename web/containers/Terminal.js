import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import Paper from 'react-sea/lib/Paper'
import {StyleSheet, css} from 'aphrodite';
import * as API from 'youkuohao-sdk/gateway'


class Terminal extends Component {

  state = {
    command: ''
  }

  componentWillMount = () => {
    this.props.actions.setNav('id4')
  }

  componentDidUpdate = () => {
    ReactDOM.findDOMNode(this.refs.input).scrollIntoView()
  }


  handleInputCommand = (e) => {
    this.setState({
      command: e.target.value
    })
  }

  handleInputKeyPress = (e) => {
    if (e.key == 'Enter') {
      this.setState({
        command: ''
      })
      this.sendCommand(this.state.command)
    }
  }

  sendCommand = () => {
    const {sendCommand} = this.props.actions
    sendCommand(this.state.command)
  }

  handleClick = () => {
    ReactDOM.findDOMNode(this.refs.input).focus()
  }

  render (){
    const {terminal} = this.props

    const {pwd} = this.props.terminal
    return (

        <Paper>

          <div className="paper-header">
            <h3>CLI</h3>
          </div>

          <div className={cx('box')} onClick={this.handleClick}>
            {(() => {
              return terminal.history.map((item, index) => {

                console.log(item)

                return (
                  <div key={index} className={css(styles.historyBlock)}>
                    <div>
                      <div>{item.pwd}</div>
                      <div>{item.command}</div>
                    </div>
                    <div>
                      <pre className={css(styles.historyBlock__pre)}>{item.result.stdout}</pre>
                      <pre className={css(styles.historyBlock__pre)}>{item.result.stderr}</pre>
                    </div>
                  </div>
                )
              })
            })()}
            <div className={cx("box__bar")}>
              <div className={cx("box__bar__pwd")}>{pwd}</div>
              <input
                ref="input"
                className={cx('box__bar__input')}
                type="text"
                onKeyPress={this.handleInputKeyPress}
                onChange={this.handleInputCommand}
                value={this.state.command}/>
            </div>
          </div>

        </Paper>

    )
  }
}

const styles = StyleSheet.create({
  box: {
    position: 'relative',
    backgroundColor: '#282828',
    width: 600,
    height: 360,
    overflow: 'auto',
    padding: 10,
  },


  box__bar__input: {
    position: 'absolute',
    backgroundColor: '#282828',
    border: 0,
    outline: 0,
    color: '#fff',
  },

  historyBlock: {
    color: '#fff'
  },

  historyBlock__pre: {
    color: '#fff'
  }

});



export default module.exports = connect((state) => {
  return {
    nav: state.nav,
    terminal: state.terminal
  }
}, (dispatch) => {
  return {
    actions: bindActionCreators({
      setNav: (next) => (dispatch) => dispatch({type: 'NAV_CHANGE', next}),
      /**
       * 发送命令
       * @returns {function()}
       */
      sendCommand: (command) => async(dispatch, getState) => {
        try {
          const {pwd} = getState().terminal
          const result = await API.sendCommand(command)
          if (result.error) throw result.error
          dispatch({
            type: 'HISTORY_PUSH',
            newHistory: {
              pwd: pwd,
              command: command,
              result: result.result
            }
          })
        } catch (e) {
          console.log(e)
        }
      },
    }, dispatch)
  }
})(Terminal)
