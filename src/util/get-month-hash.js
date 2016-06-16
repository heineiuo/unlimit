import md5 from 'blueimp-md5'

const getYearAndMonth = function(){
  var date = new Date()
  return `${date.getFullYear()}${getFullMonth(date.getMonth())}`
}

const getFullMonth = function(rawMonth){
  rawMonth++
  return rawMonth.length==2?rawMonth:`0${rawMonth}`
}

const getMonthHash = function(){
  return md5(getYearAndMonth())
}

export default getMonthHash