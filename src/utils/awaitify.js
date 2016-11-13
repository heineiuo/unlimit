const awaitify = function(fn, returnArray = false){
  return function(){
    const args = Array.prototype.slice.call(arguments, 0);
    return new Promise(function(resolve, reject){
      const callback = function(err, a, b, c, d, e, f){
        if (err) return reject(err);
        const resultArray = Array.prototype.slice.call(arguments, 1);
        if (!returnArray) return resolve(resultArray[0]);
        resolve(resultArray)
      };
      args.push(callback);
      fn.apply(this, args)
    })
  }
};

export default awaitify