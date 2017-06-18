import letiny from 'letiny'
import Joi from 'joi'
import getConfig from '../../config'
import {tmpdir} from 'os'
import mkdirp from 'mkdirp'

const mutateApproveDomainSchema = Joi.object().keys({
  domain: Joi.string().required(),
  driveId: Joi.string().required(),
})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateApproveDomainSchema, {allowUnknown: true});;
  if (validated.error) return reject(validated.error);
  const {domain, driveId} = validated.value;
  try {
    // todo check rate limit
    const {https: {email}, datadir} = await getConfig();
    const pemdir = datadir + '/pem';
    mkdirp.sync(`${pemdir}/${domain}`);
    letiny.getCert({
      email,
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
