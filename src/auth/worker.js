window.addEventListener('message', (e) => {
  postMessage({
    token: localStorage.token || localStorage.userToken || 'no token'
  })
}, false);