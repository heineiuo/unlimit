import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'

/**
 *
 * @param req
 * @param res
 * @param next
 */
export default async (req, res, next) => {

  const {pageName} = req.params
  const {pages, template, Home} = res.theme

  if (!pages.hasOwnProperty(pageName)) return next()

  const Page = pages[pageName]

  const Markup = ReactDOMServer.renderToString(
    <Page />
  )

  res.render(template({
    Markup,
    title: pageName,
    themeDir: '/themes/default',
    scripts: [
      '/setup.js'
    ]
  }))
}
