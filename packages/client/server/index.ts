import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { createServer as createViteServer, type ViteDevServer } from 'vite'

dotenv.config()

const port = process.env.PORT || 3000
const clientPath = path.join(__dirname, '..')
const isDev = process.env.NODE_ENV === 'development'

async function createServer() {
  const app = express()
  let vite: ViteDevServer | undefined

  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    })

    app.use(vite.middlewares)
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    )
  }

  app.get('/{*splat}', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let render: () => Promise<string>
      let template: string
      if (vite) {
        let template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        )

        template = await vite.transformIndexHtml(url, template)

        const { render } = await vite.ssrLoadModule(
          path.join(clientPath, 'src/entry-server.tsx')
        )
        const appHtml = await render()
        const html = template.replace(`<!--ssr-outlet-->`, appHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        )

        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.js'
        )

        render = (await import(pathToServer)).render

        const appHtml = await render()
        const html = template.replace(`<!--ssr-outlet-->`, appHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      }
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`)
  })
}

createServer()
