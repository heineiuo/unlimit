import React, {Component} from 'react'
import {css, StyleSheet} from 'aphrodite'
import {Link} from 'react-router-dom'


class MessageList extends Component {

  state = {
  };

  render () {
    const {postList} = this.props;

    return (
      <div>
        MessageList
        <div style={{paddingTop: 76, margin: '0 auto', width: '100%', maxWidth: 1000}}>
          {
            postList.map(item => (
              <div key={item._key} className={css(styles.item)}>
                <Link to={`/post/${item._key}`}>
                  <div>
                    <div className="title">{item.title}</div>
                    <div>{String(new Date(item.time||Date.now()))}</div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>

    )
  }
}




const styles = StyleSheet.create({


  item: {
    backgroundColor: '#FFF',
    minHeight: 80,
    borderBottom: '1px solid #D9D9D9'
  }


});




export default MessageList;
