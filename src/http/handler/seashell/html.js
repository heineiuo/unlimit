module.exports = async (req, res, next) => {
  try {
    const {seashellResult} = res.locals;
    /**
     * 检查headers
     */
    if (!seashellResult.headers.__HTML) return next();
    res.write(seashellResult.body.html);
    res.end()
  } catch(e){
    next(e)
  }
};
