import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'

class FooterShows extends Component {

  static defaultProps = {
    homePath: '',
    staticPath: '/home'
  }

  render () {

    const {staticPath, homePath} = this.props

    return (
      <div
        //className="shows container"
        className={css(styles.shows)}
      >
        <div className={css(styles.row)}>
          <div className={css(styles.titlebarOverline)} >
            <div className={css(styles.titlebarOverline__line)}/>
            <div className={css(styles.titlebarOverline__title)}>xxx</div>
            <div className={css(styles.titlebarOverline__line)}/>
          </div>
        </div>
        <div className={css(styles.row, styles.spaceAround)}>
          {
            [
              {img: '', link: '/post/37', title: 'xxx'}
            ].map(item => (
              <div className="col-xs-6 col-md-3" key={item.link}>
                <Link to={item.link}>
                  <img src={item.img} alt="" className={css(styles.imgResponsive)} />
                  <div className={css(styles.shows__caption)}>{item.title}</div>
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
  ...commonStyle,

  shows: {
    borderBottom: '2px solid #669f36',
    paddingTop: 40,
    paddingBottom: 40,
    marginBottom: 60,
  },

  shows__caption: {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    lineHeight: '40px',
    fontSize: 16,
    color: '#669f36'
  },

  // titlebarOverline
  titlebarOverline: {
    flex: 1,
    display: 'flex',
    paddingTop: 28,
    justifyContent: 'space-around'
  },

  titlebarOverline__line: {
    height: 2,
    flex: 1,
    backgroundColor: '#669f36'
  },

  titlebarOverline__title: {
    width: 160,
    textAlign: 'center',
    fontSize: 28,
    marginTop: -28,
    lineHeight: '50px',
    color: '#669f36',
    height: 50,
  }

});


export default FooterShows
