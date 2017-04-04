const setTitle = (title) => {
  document.title = title;
  return {
    type: 'nav__titleUpdate',
    payload: {title}
  }
};

export default module.exports = setTitle