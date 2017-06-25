import path from 'path'

const appmeta = [
  {
    appName: '@unlimit/preview',
    type: 'image',
    prettyName: 'Preview',
    support: ['.png', '.jpg', '.gif', '.jpeg']
  },
  {
    appName: '@unlimit/familytree',
    type: 'graph',
    prettyName: 'Family Tree',
    support: ['.familytree']
  },
  {
    appName: '@unlimit/draft',
    type: 'blog',
    prettyName: 'Draft',
    support: ['.blog']
  },
  {
    appName: '@unlimit/text-editor',
    type: 'code',
    prettyName: 'Ace',
    support: ['.js', '.html', '.css', '.json', '.xml', '']
  }
];

const pickoutPreview = (appmeta) => {
  return appmeta.filter(app => app.appName !== 'preview')
};


const matchAppByPathname = (pathname) => {
  const extname = path.extname(pathname);

  const result = [];
  appmeta.forEach(item => {
    if (item.support.indexOf(extname) > -1 ) {
      result.push(item)
    }
  });
  return result;
};

export {
  appmeta,
  matchAppByPathname,
  pickoutPreview
}
