import React, {Component} from 'react'
import {Link} from 'react-router'
import Body from 'react-sea/lib/Body'
import {css, StyleSheet} from 'aphrodite/no-important'

class Wrap extends Component {

  componentWillMount = () => {

  };

  componentDidMount = () => {

  };

  render(){
    return (
      <div>
        <Body ref={body => this.body = body} />
        <div>
          <div className={css(styles.header)}>
            <div className={css(styles.headerBar)}>
              <Link to="/">首页</Link>
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: 340,
    backgroundImage: 'linear-gradient(70deg, #bc94d8, #92d8f1)'
  },

});

module.exports = Wrap;