module.exports = {
    apps: [
      {
        name: 'mi-app', // Nombre de la aplicación
        script: 'npm',
        args: 'run dev', // El comando que ejecuta `npm run dev`
        cwd: './', // Directorio de trabajo, puedes dejarlo como `./` si estás en el directorio raíz de tu proyecto
        watch: true, // Opcional, para reiniciar automáticamente cuando haya cambios en los archivos
        env: {
          NODE_ENV: 'development', // Configura variables de entorno si es necesario
        },
      },
    ],
  };
  