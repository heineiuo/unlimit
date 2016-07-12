import {App} from 'seashell'
import config from '../util/config'

const start = async () => {


  const app = new App()

  app.use(require('../router'))

  app.connect(config.seashell)

}

start()