import React, {Component} from 'react'
import { getVisibleSelectionRect } from 'draft-js'
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';


class Toolbar extends Component {

  state = {
    className: 'toolbar',
    style: {},
    isReady: false
  }

  componentWillMount = () => {
    process.nextTick(() => {
      this.setState({isReady: true})
    })
  }

  render() {
    const { store, structure } = this.props;
    return (
      <div
        ref={(ref) => this.toolbar = ref}
      >
        {
          !this.state.isReady?null:
            structure.map((Component, index) => (
              <Component
                key={index}
                theme={buttonStyles}
                getEditorState={store.getItem('getEditorState')}
                setEditorState={store.getItem('setEditorState')}
              />
            ))
        }
      </div>
    );
  }
}

const buttonStyles = {

}

export default Toolbar