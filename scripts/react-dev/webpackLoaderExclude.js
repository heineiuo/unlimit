module.exports = function (list) {
  return new RegExp('(node_modules\/)(?!'+list.join('|')+')');
};