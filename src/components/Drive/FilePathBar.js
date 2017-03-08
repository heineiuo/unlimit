import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import {Link} from "react-router"

class FilePathBar extends Component {
  render() {
    const {pathname, hrefPrefix, driveName, isFile} = this.props;
    const parsed = pathname.split('/').filter(item => item != '');
    let prevPath = '';
    const linkClass = css(
      styles.dirname,
      styles.dirname_link,
    );

    return (
      <div className={css(styles.path)}>
        <Link className={linkClass} to={`${hrefPrefix}/file`}>{driveName}</Link>
        {
          parsed.map((dirname, index) => {
            const currentLink = `${hrefPrefix}${prevPath}/file/${dirname}`;
            prevPath = `${prevPath}/file/${dirname}`;
            return (
              <span key={index}>
                <span className={css(styles.separator)}>/</span>
                <span>
                  {
                    index == parsed.length - 1 ?
                      <span className={css(styles.dirname)}>{dirname}</span> :
                      <Link className={linkClass} to={currentLink}>{dirname}</Link>
                  }
                </span>
              </span>
            )
          })
        }
        <span className={css(styles.separator)}>
          {isFile ? null : '/'}
        </span>
      </div>
    )
  }
}


const styles = StyleSheet.create({

  path: {
    padding: '4px 0px',
  },
  separator: {
    margin: "0 2px",
    color: '#888'
  },
  dirname: {
    flex: 1,
    padding: '0 4px'
  },
  dirname_link: {
    textDecoration: 'none',
    color: '#1077ff',
    ":hover": {
      textDecoration: 'underline',
      // backgroundColor: '#EEE'
    }
  },
});


export default module.exports = FilePathBar