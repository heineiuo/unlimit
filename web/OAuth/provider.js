
const onMessage = (e) => {
  const {data, source, origin} = e;
  this.target.source = source;
  this.target.origin = origin;
  if (data.key === 'messageReadState') {
    localStorage.setItem(data.key, JSON.stringify(data.value))
  }

  if (data.type === 'REQUEST_TOKEN') {
    source.postMessage({
      type: 'RESPONSE_REQUEST_TOKEN',
      callbackId: data.callbackId,
      token: this.props.account.token
    }, origin)
    return null;
  }

  if (data.type === 'DESTROY_TOKEN') {
    source.postMessage({
      type: 'RESPONSE_DESTROY_TOKEN'
    })
    return null
  }
}

if (window.parent) {
  window.parent.postMessage({type: 'READY'}, '*');
  // window.addEventListener("storage", this.onStorage);
  window.addEventListener("message", onMessage, false);
}
