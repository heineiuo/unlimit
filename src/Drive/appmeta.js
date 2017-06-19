import path from 'path'

const appmeta = [
  {
    appName: 'preview',
    type: 'image',
    support: ['.png', '.jpg', '.gif', '.jpeg']
  },
  {
    appName: 'familytree',
    type: 'graph',
    prettyName: 'Family Tree',
    support: ['.familytree']
  },
  {
    appName: 'drive-draft',
    type: 'blog',
    prettyName: 'Draft',
    support: ['.blog']
  },
  {
    appName: 'drive-text-editor',
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
