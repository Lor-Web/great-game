const fs = require('node:fs')

fs.copyFileSync('.env.sample', '.env')

fs.mkdirSync('tmp/pgdata', { recursive: true })
