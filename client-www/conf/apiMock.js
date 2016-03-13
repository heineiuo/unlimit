var apiMock = module.exports = {}

apiMock.getArticleList = function(){
  return {
    list: [
      {title: 'hi, it is a title'},
      {title: 'hi, it is a title2'},
      {title: 'hi, it is a title3'}
    ]
  }
}

apiMock.serverStatus = function () {

  return {
    isInstalled: false
  }

}




