const fs = require('node:fs/promises')
const path = require('node:path')

const pc = require('picocolors')

async function ls (folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch (err) {
    console.error(pc.red(`X No se ha podido leer el directorio ${folder}`))
    process.exit(1)
  }

  const filesPromises = files.map(async (file) => {
    /**
     * El mapeo ocurre el paralelo (por eso es más rápido)
     * Por este motivo el callback, aunque sea async, no espera
     * en secuencial al await.
     * Si quisiéramos hacerlo en secuencial, deberíamos usar el for..of
     */
    const filePath = path.join(folder, file)
    let stats
    try {
      stats = await fs.stat(filePath)
    } catch (err) {
      console.error(pc.red(`X No se ha podido leer el archivo - ${filePath}`))
      process.exit(1)
    }

    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'd' : 'f'
    const fileSize = stats.size
    const lastModified = stats.mtime.toLocaleString()

    return `${fileType} ${pc.blue(file.padEnd(30))} ${pc.green(
      fileSize.toString().padStart(2) + ' bytes'
    )} - Last mod. ${pc.yellow(lastModified)}`
  })

  const filesInfo = await Promise.all(filesPromises)
  filesInfo.forEach((fileInfo) => console.log(fileInfo))
}

const folder = process.argv[2] || '.'
ls(folder)
