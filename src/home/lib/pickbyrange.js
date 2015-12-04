
function pickByRange(array, start, end){
  var result = []
  for (var i=start; i<=end && i<array.length; i++) {
    result.push(array[i])
  }
  return result
}
