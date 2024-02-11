// process

// argumentos del proceso actual (de la línea de comandos)
// console.log(process.argv)

// controlar el process
// process.exit(0) //--> Ha ido todo bien, y queremos que salga
// process.exit(1) // --> ha ocurrido un error y queremos que salga

// controlamos eventos del proceso
// escuchar eventos, y errores (que se pasen como eventos)
// process.on('exit', () => {
//  // limpiar los recursos...
// })

// current working directory --> desde donde se está ejecutando el proceso
// OJO: no es dónde está el archivo, sino desde dónde ejecutamos el proceso,
// en qué carpeta hemos inicializado el proceso
console.log(process.cwd())

// variables de entorno
console.log(process.env.PEPITO)
// en la consola --> PEPITO=hola node 7.process.js
