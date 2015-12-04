
function filterHTML(str) {
  str = str.replace(/<\/?[^>]+>/g, ''); // 去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
  str = str.replace(/\n[\s| | ]*\r/g, '\n'); // 去除多余空行
  str = str.replace(/&nbsp;/ig, ''); // 去掉&nbsp;
  return str;
}