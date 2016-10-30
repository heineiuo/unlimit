import {exec} from 'child-process-promise'

/**
 * @api {POST} /terminal cli
 * @param req
 * @param res
 * @param next
 */
module.exports = async (req, res, next) => {

  try {
    const result = await exec(req.body.command)
    res.json({
      result: {
        stdout: result.stdout,
        stderr: result.stderr
      }
    })
  } catch (e){
    res.json({
      result: {
        stdout: '',
        stderr: e.stderr
      }
    })
  }

}