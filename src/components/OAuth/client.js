
var target = {
  source: null,
  origin: null
};

window.addEventListener("storage", function (e) {
  if (e.key === 'messageReadState' && target.source) {
    const data = {
      key: 'messageReadState',
      value: JSON.parse(e.newValue)
    };
    target.source.postMessage(data, target.origin)
  }
});

window.addEventListener("message", function (e) {
  var {data, source, origin} = e;
  target.source = source;
  target.origin = origin;
  if (data.key === 'messageReadState') {
    localStorage.setItem(data.key, JSON.stringify(data.value))
  }
}, false);