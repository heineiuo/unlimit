import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'

/**
 *
 * @param req
 * @param res
 * @param next
 */
export default async (req, res, next) => {

  const {Home, template} = res.theme
  const Markup = ReactDOMServer.renderToString(
    <Home />
  )

  res.render(template({
    Markup,
    themeDir: '/themes/default',
    scripts: [
      '/setup.js'
    ]
  }))
}
