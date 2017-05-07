const SmileOAuth = (callback) => {
  const iframeOrigin = 'http://local.youkuohao.com';
  const iframe = document.createElement('iframe');
  iframe.style = 'display: none';
  iframe.src = iframeOrigin + "/#/oauth/iframe";
  document.body.appendChild(iframe);

  const stack = {};
  let isCallbackCalled = false;

  const cross = {
    /**
     * 如果是普通站点，
     *  - 已经登录，在授权期，直接返回accessToken
     *  - 已经登录，不在授权期，返回授权错误，建议打开授权页面
     *  - 未登录，返回未登录错误，建议打开授权页面
     *
     * 如果是合作站点，
     *  - 已经登录，直接返回accessToken
     *  - 未登录，没有传递用户名密码， 返回未登录错误，建议打开授权页面
     *  - 未登录，但是传递了用户名密码， 成功则返回accessToken, 否则返回错误信息
     *
     *  @param options
     *  - options.loginForm 用户名密码登录， default: undefined
     *  - options.enableOpenWindow 如果用户未登录/未授权，是否打开登录界面，default: true
     *  @param callback
     *
     */
    requestToken: (options, callback) => {
      const opts = {
        enableOpenWindow: true,
      }
      Object.assign(opts, options, {
        callbackId: Date.now(),
        type: 'REQUEST_TOKEN'
      })
      stack[options.callbackId] = callback;
      iframe.contentWindow.postMessage(opts, iframeOrigin)
    },

    /**
     * 所有站点通用，销毁accessToken
     */
    destroyToken: (options, callback) => {
      callback('this method is in draft state')
    },
  }

  window.addEventListener('message', (e) => {
    if (e.origin === iframeOrigin) {
      if (!isCallbackCalled) {
        isCallbackCalled = true;
        callback(null, cross)
      }
      if (e.data.type === 'RESPONSE_REQUEST_TOKEN') {
        if (stack.hasOwnProperty(e.data.callbackId)) {
          stack[e.data.callbackId](null, e.data)
          delete stack[e.data.callbackId]
        }
        return null;
      }

      if (e.data.type === 'RESPONSE_RESPONSE_TOKEN') {
        if (stack.hasOwnProperty(e.data.callbackId)) {
          stack[e.data.callbackId](null, e.data)
          delete stack[e.data.callbackId]
        }
        return null;
      }
    }
  })
}

module.exports = SmileOAuth;