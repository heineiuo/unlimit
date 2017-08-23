import letiny from 'letiny'
import Joi from 'joi'
import {tmpdir} from 'os'
import mkdirp from 'mkdirp'
import path from 'path'

const mutateApproveDomainSchema = Joi.object().keys({
  domain: Joi.string().required(),
  driveId: Joi.string().required(),
})

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateApproveDomainSchema, {allowUnknown: true});;
  if (validated.error) return reject(validated.error);
  const {domain, driveId} = validated.value;
  try {
    const {HTTPS_EMAIL, DATA_DIR} = process.env;
    
    // todo check rate limit
    const pemdir = path.resolve(DATA_DIR, './pem')
    mkdirp.sync(`${pemdir}/${domain}`);
    letiny.getCert({
      email: HTTPS_EMAIL,
      domains: domain, //'example.com,www.example.com',
      webroot: `${tmpdir()}`,
      pfxFile: `${pemdir}/${domain}/pfx.pem`,
      certFile: `${pemdir}/${domain}/cert.pem`,
      caFile: `${pemdir}/${domain}/ca.pem`,
      privateKey: `${pemdir}/${domain}/key.pem`,
      accountKey: `${pemdir}/${domain}/account.pem`,
      agreeTerms: true
    }, function(err) {
      if (err) return reject(err);
      return resolve({error: null})
    });
  } catch(e){
    reject(e)
  }
})
