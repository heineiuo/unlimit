import Home from '../containers/Home'
// export CategoryDetail from './containers/CategoryDetail'
// export PostDetail from './containers/PostDetail'
import SpecialPage from '../containers/SpecialPage'

/**
 * @param options
 */
const template = (options) => {
  const opt = {
    title: '',
    scripts: [],
    themeDir: ''
  };
  Object.assign(opt, options);

  return `<!doctype html>
  <html>
  <head>
    <title>${opt.title}</title>
    <link rel="stylesheet" href="${opt.themeDir}/bootstrap.min.css"/>
    <link rel="stylesheet" href="${opt.themeDir}/style.css"/>
  </head>
  <body>
    <div id="app">${opt.Markup}</div>
    <script src="${opt.themeDir}/index.js"></script>
  </body>
  </html>`
};

const pages = {
  about: SpecialPage
};


export {
  Home,
  pages,
  template
}
