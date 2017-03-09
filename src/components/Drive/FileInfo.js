import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import Button from "react-sea/lib/Button"
import path from 'path'
import IntegrateApp from "../IntegrateApp"
// import Modal from "react-modal"
// import utf8 from 'utf8'
import {appmeta, matchAppByPathname} from './appmeta'

class FileInfo extends Component {

  state = {
    infoState: 0, // 0 preview, 1 edit, 2, edit in full screen
  };

  _open = (appName) => {
    const {pathname, hostname} = this.props;
    this.integrateApp.open({
      hostname, pathname, appName
    });
    this.setState({
      infoState: 1,
      appName,
    })
  };

  handleCloseIntegrateApp = () => {
    this.setState({
      infoState: 0
    })
  };

  render(){
    const {pathname, injectAsyncReducer, hostname, cat} = this.props;
    const matchApp = matchAppByPathname(pathname);
    const {infoState} = this.state;

    const buffer = new Buffer(cat);
    const blobUrl = 'data:image;base64,'+buffer.toString('base64');

    return (
      <div style={{paddingTop: 10}}>
        <div className={css(styles.fileInfo, infoState == 0 && styles.fileInfo_show)}>
          <div className={css(styles.info)}>
            <div>
              <div>文件名：{path.basename(pathname)}</div>
            </div>
            <div>
              <div>打开方式：</div>
              <div style={{display: 'flex'}}>
                {
                  matchApp.filter(item => item.appName != 'preview').map(app => (
                    <div
                      style={{padding: 2}}
                      key={app.appName}>
                      <Button
                        style={{width: 100}}
                        onClick={() => this._open(app.appName, pathname)}>
                        {app.prettyName}
                      </Button>
                    </div>
                  ))
                }
              </div>
            </div>
            {/*<TextEditor text={cat} ref={(editor) => this.editor = editor}/>*/}
          </div>
          <div className={css(styles.preview)}>
            <div>预览：</div>
            <div className={css(styles.preview__box)}>
              {
                (matchApp.length == 0 || matchApp[0].type != 'image')?
                  <div className={css(styles.preview__normal)}>{matchApp[0].type}</div>:
                  <img className={css(styles.preview__img)} src={blobUrl} alt=""/>
              }
            </div>
          </div>

        </div>
          <IntegrateApp
            ref={ref => this.integrateApp = ref}
            injectAsyncReducer={injectAsyncReducer}
            onClose={this.handleCloseIntegrateApp}
          />
      </div>

    )
  }
}


const styles = StyleSheet.create({

  fileInfo: {
    display: 'none',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start'
  },

  fileInfo_show: {
    display: 'flex'
  },

  info: {
    width: 300
  },

  preview: {
    flex: 1,
  },

  preview__box: {
    border: '1px solid #E9E9E9'
  },

  preview__normal: {
    height: '300px',
    lineHeight: '300px',
    textAlign: 'center'
  },

  preview__img: {
    maxWidth: '100%'
  },



  // modal
  modal__content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 0,
    overflow: 'auto',
    overflowScrolling: 'touch',
  },

  modal__overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }

});


export default FileInfo