import decorateComponentWithProps from 'decorate-component-with-props'
import createStore from './createStore'
import Toolbar from './Toolbar'

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
} from './buttons'

export default () => {

  const store = createStore({
    isVisible: true,
  });

  const structure = [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
  ]

  const toolbarProps = {
    store,
    structure,
  };

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },
    onChange: (editorState) => {
      store.updateItem('editorState', editorState);
      return editorState;
    },
    Toolbar: decorateComponentWithProps(Toolbar, toolbarProps),
  };
};