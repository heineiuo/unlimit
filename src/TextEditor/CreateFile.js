import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Input from 'react-sea/lib/Input'
import Button from 'react-sea/lib/Button'

class CreateFile extends Component {

  state = {
    fileName: '',
    ext: ''
  };

  createFile = () => {
    const {createFile, driveId, parentId} = this.props;
    const {fileName, ext} = this.state;
    createFile({
      driveId,
      parentId,
      name: `${fileName}.${ext}`
    })
  };


  render(){
    const {fileName, ext} = this.state;

    return (
      <div>
        <Input
          type="text"
          value={fileName}
          onChange={(e) => this.setState({fileName: e.target.value})}
        />
        <Input
          type="text"
          value={ext}
          onChange={(e) => this.setState({ext: e.target.value})}
        />
        <Button onClick={this.createFile}>创建</Button>
      </div>
    )
  }
}


export default module.exports = connect(
  (store) => ({
    account: store.account,
    fileContent: store.file,
  }),
  (dispatch) => bindActionCreators({
    createFile: require('../actions/file/createFile').default
  }, dispatch)
)(CreateFile);
