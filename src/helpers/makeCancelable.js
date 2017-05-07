const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  wrappedPromise.promise = wrappedPromise;
  wrappedPromise.cancel = () => {
    hasCanceled_ = true;
  };

  return wrappedPromise
};

export default makeCancelable