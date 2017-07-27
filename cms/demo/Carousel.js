import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {StyleSheet, css} from 'aphrodite'
import commonStyle from './styles'
import {ViewPager, Frame, Track, View} from 'react-view-pager'

class Carousel extends Component {


  static defaultProps = {
    homePath: '',
    staticPath: '/home'
  }

  componentDidMount = () => {
    this.t = setInterval(() => {
      this.track.next()
    }, 2800)
    window.addEventListener('blur', this.onWindowBlur, false)
  }

  componentWillUnmount = () => {
    clearInterval(this.t)
    window.removeEventListener('blur', this.onWindowBlur, false)
    window.removeEventListener('focus', this.onWindowFocus, false)
  }

  onWindowBlur = (e) => {
    clearInterval(this.t)
    window.addEventListener('focus', this.onWindowFocus, false)
  }

  onWindowFocus = (e) => {
    this.t = setInterval(() => {
      this.track.next()
    }, 2800)
    window.removeEventListener('focus', this.onWindowFocus, false)
  }


  render () {

    const {staticPath, homePath} = this.props;

    return (
      <div>
        <ViewPager>
          <Frame className="frame">
            <Track
              ref={ref => this.track = ref}
              viewsToShow={1}
              infinite
              className="track">
              <View className="view">
                <Link to={'/page/xxxx'}>
                  <img src={null} className={css(styles.imgResponsive)} alt="1111" />
                </Link>
              </View>
              <View className="view">
                <Link to={'/page/xxxx'}>
                  <img src={null} className={css(styles.imgResponsive)} alt="22222" />
                </Link>
              </View>
              <View className="view">
                <Link to={'/page/xxxx'}>
                  <img src={null} className={css(styles.imgResponsive)} alt="3333" />
                </Link>
              </View>
              <View className="view">
                <Link to={'/page/xxxx'}>
                  <img src={null} className={css(styles.imgResponsive)} alt="444444" />
                </Link>
              </View>
            </Track>
          </Frame>
        </ViewPager>
      </div>
    );

  }
}


const styles = StyleSheet.create({
  ...commonStyle,


});


export default Carousel
