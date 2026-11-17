import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'

const getFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

export const generateSwManifest = (): Plugin => {
  let outDir: string

  return {
    name: 'generate-sw-manifest',
    apply: 'build',
    enforce: 'post',

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },

    async closeBundle() {
      const files = await getFiles(outDir)

      const urls = files
        .sort()
        .filter(file => {
          const name = path.basename(file)
          return name !== 'sw.js' && name !== 'sw-manifest.json'
        })
        .map(file => {
          const relativePath = path.relative(outDir, file)
          return `/${relativePath.split(path.sep).join('/')}`
        })

      const hash = createHash('sha256')

      for (const file of files) {
        if (
          path.basename(file) === 'sw.js' ||
          path.basename(file) === 'sw-manifest.json'
        ) {
          continue
        }

        hash.update(path.relative(outDir, file))
        hash.update(await readFile(file))
      }

      const buildVersion = hash.digest('hex').slice(0, 8)

      await writeFile(
        path.join(outDir, 'sw-manifest.json'),
        JSON.stringify(urls, null, 2)
      )
      const swPath = path.join(outDir, 'sw.js')
      const swContent = await readFile(swPath, 'utf-8')

      const updatedSwContent = swContent
        .replace('self.__SW_MANIFEST__', JSON.stringify(urls))
        .replace('__BUILD_VERSION__', buildVersion)

      await writeFile(swPath, updatedSwContent)
    },
  }
}
