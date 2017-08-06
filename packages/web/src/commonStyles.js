const globalHeaderBarHeight = 50;

export default {
  globalHeaderBar: {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    height: `${globalHeaderBarHeight}px`,
    // borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#FFF',
    // backgroundColor: '#24292e',
    padding: '0 20px',
    lineHeight: `${globalHeaderBarHeight}px`,
    marginBottom: 10,
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    ":hover": {
      color: '#FFF'
    },
    ":active": {
      color: '#FFF'
    }
  },

  card: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 480,
    height: 618,
    margin: '60px auto 0',
    padding: '70px 40px 30px 40px',
    background: '#fff',
    fontSize: 14,
    borderRadius: 2,
    boxShadow: '0 2px 3px rgba(213,213,213,0.7)'
  },

  logo: {
    width: 200,
    height: 200,
    textAlign: 'center',
    margin: '0 auto',
    fontSize: 43,
    fontFamily: 'Serif',
    color: '#333',
    lineHeight: '55px',
    fontWeight: 'bold'
  },

  tabbar: {
    textAlign: 'center',
    fontSize: 17,
    borderBottom: '1px solid #E9E9E9',
    color: '#41464b',
    marginBottom: 20
  },

  tab: {
    display: 'inline-block',
    height: 40,
    lineHeight: '20px',
    width: 80,
    margin: '0 20px -1px',
    borderBottom: '2px solid transparent',
    opacity: 0.65,
    transition: 'all .25s ease',
    cursor: 'pointer',

    ':hover': {
      borderBottom: '2px solid #8f9396',
      opacity: 1
    }
  },

  'tab--active': {
    borderBottom: '2px solid #8f9396',
    opacity: 1
  },

  errorMsg: {
    display: 'none'
  },

  'errorMsg--show': {
    display: 'block'
  },

  clearfix: {
    flex: 1,
    padding: '10px 0',
    ':after': {
      display: 'table',
      clear: 'both',
      content: '""',
    }
  },

  forgot: {
    float: 'left',
    cursor: 'pointer',
    color: '#333',
    textDecoration: 'none'
  },

  registerBtn: {
    textDecoration: 'none',
    cursor: 'pointer',
    color: '#333',
    float: 'right'
  },

  input: {
    backgroundColor: '#f5f5f5',
    height: '44px',
    border: '0px',
    padding: '0 8px',
    color: '#333',
    marginBottom: '2px'
  },

  button: {
    marginTop: '10px',
    // backgroundColor: '#41464b',
    // color: '#fff',
    cursor: 'pointer',
    borderRadius: '2px'
  },

  modal__overlay : {
    position : 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  modal__content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '380px',
    padding: '0px',
    borderRadius: 0,
    border:0,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },

  imgResponsive: {
    width: '100%'
  },

}
