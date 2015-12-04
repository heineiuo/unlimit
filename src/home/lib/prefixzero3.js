function prefixZero3(num){
  num = String(num)
  if (num.length == 1) {
    num = '00'+num
  } else if (num.length ==2){
    num = '0'+num
  }
  return num
}