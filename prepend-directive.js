// This prepends the 'use client' directive to all dist files so that they can
// be used in Next.js 13 as client components without additional work.
// (Microbundle strips it out if it's in the source code directly.)

const fs = require('fs')
const package = require('./package.json')

const base = package.main.split('.').slice(0, -1).join('.')
const variations = ['modern.mjs', 'umd.js']
const fileNames = [
  package.main,
  package.module,
  ...variations.map(x => `${base}.${x}`),
]

for (const name of fileNames) {
  const src = fs.readFileSync(name, { encoding: 'utf8' })
  fs.writeFileSync(name, `'use client';${src}`)
}
