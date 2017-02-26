import {Model} from "sprucejs"
import Joi from "joi"


class Tag extends Model {

  list = (req) => new Promise(async (resolve, reject) => {

  });

  resolve = (req) => {
    const {action} = req;
    if (action == 'list') return this.list(req);
    return new Promise((resolve, reject) => reject(new Error('NOT_FOUND')))

  }
}

export default module.exports = Tag;