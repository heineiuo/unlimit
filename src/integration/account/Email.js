
import {Model} from 'sprucejs'

class Email extends Model {

  /**
   *
   */
  _getUserIdWithUpset = (email, userId) => new Promise(async (resolve, reject) => {
    try {
      const {db, reducers} = this.props;

      try {
        const result = await db.get(email);
        resolve(result)
      } catch(e){
        if (e.name != 'NotFoundError') return reject(e);
        try {
          const user = await reducers.User._createUser({email});
          await db.put(email, user.id);
          resolve(user.id)
        } catch(e){
          reject(e)
        }
      }
    } catch (e) {
      reject(e)
    }
  });

}

module.exports = Email;