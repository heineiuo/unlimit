
mData.serverStatus = [1, 'POST', conf.apibase+'/status']
mData.serverStatus.mock = function () {

  return {
    isInstalled: false
  }

}




